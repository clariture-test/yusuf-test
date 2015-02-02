/* Debug variables */

var orig_button_string = null;
var orig_msgbox_string = null;


function updateFormButton(f_running) {
	var run_button = $('#run_button').get(0);

	if ( ! orig_button_string ) 
		orig_button_string = run_button.value;

	if ( f_running ) {
		if ( run_button.disabled ) return;

		run_button.disabled = true;
		run_button.value = " Report is running...";
	}
	else {
		if ( ! run_button.disabled ) return;

		run_button.value = orig_button_string;
		run_button.disabled = false;
	}
}

function onProcessComplete( ) {
	console.log("onProcessComplete():");
	updateFormButton(false)

	var my_div = $('#msg_div').get(0);
	my_div.innerHTML += '<br/><br/>' + orig_msgbox_string;

	var html_part = '<div class="chapter" id="chapter_download">'
			+ '<p class="heading">Download Data</p>'
			+ '<div class="content">Download data links are below:'
			+ '<br/><br/>'
			+ '<ul>'
			+ '<li><a href="#">Download raw data</a></li>'
			+ '<li><a href="#">Export results to XML</a></li>'
			+ '<li>Email results to : <input type="text" /> <input type="submit" value="Submit" /></li>'
			+ '</ul>'
			+ '</div>'
			+ '</div>';
	//$('#contain_chapter').append(html_part);

	/* Collapsable */
    /*
	var download_id = "#chapter_download";
	setTimeout(function() { 
		$(download_id + " p.heading").click(function() {
			$(this).next(".content").slideToggle(500);
		});
	}, 0);
    */
}

function progressCallback(f_data) {
	console.log("progressCallback(): progress: " + f_data["progress"] +
									" message: " + f_data["message"]);
	if ( ! orig_msgbox_string )
		orig_msgbox_string = $('#msg_div').get(0).innerHTML;

	var my_div = $('#msg_div').get(0);
	my_div.innerHTML = f_data["progress"] + '% is complete. ' + f_data["message"]; 

	var current_name = '#chapter_' + f_data["output"]["id"];
	console.log("progressCallback(): chapter: " + current_name);
	if ( $(current_name).length == 0 ) {
		var head_color = "style='background-color: ";
		if ( f_data["output"]["status"] == "WARNING" )
			//head_color += "#FFF152";
			head_color += "#FFFF66";
		else if ( f_data["output"]["status"] == "CRITICAL" )
			//head_color += "#D42222";
			head_color += "#FF6666";
		//else head_color += "#1FF218";
		else head_color += "#80FF00";
		head_color += ";'";
		var html_part = '<div class="chapter" id="chapter_' + f_data["output"]["id"] + '">'
			+ '<p class="heading" ' + head_color + '>' + f_data["output"]["name"] + '</p>'
			+ '<div class="content"><pre>' + f_data["output"]["detail"] + '</pre></div>'
			+ '</div>';
		console.log("progressCallback(): html_part: " + html_part);
		$('#contain_chapter').append(html_part);

		/* Collapsable */
		setTimeout(function() { 
			$(current_name + " div.content").hide();
			$(current_name + " p.heading").click(function() {
				$(this).next(".content").slideToggle(500);
			});
		}, 0);
	}
	else {
		console.log("progressCallback(): current_chapter: " + current_name);
		var current_chapter = $(current_name + ' div.content').get(0);
		current_chapter.innerHTML = f_data["output"]["detail"];
	}

	if ( f_data["progress"] >= 100 ) {
		onProcessComplete();
	}
}


var _progress_buffer = "";
function onReceivedProgress(f_request, f_txt) {
	var json_starts = 0;
	var json_ends;
	_progress_buffer += f_txt;

	while ( json_starts < _progress_buffer.length ) {
		var curl_count = 0, bracket_count = 0;
		var found = false;
		for(json_ends=json_starts; json_ends < _progress_buffer.length; json_ends++) {
			if ( _progress_buffer[json_ends] == '{' ) curl_count += 1;
			else if ( _progress_buffer[json_ends] == '}' ) curl_count -= 1;
			else if ( _progress_buffer[json_ends] == '[' ) bracket_count += 1;
			else if ( _progress_buffer[json_ends] == ']' ) bracket_count -= 1;

			if ( curl_count == 0 && bracket_count == 0 ) {
				found = true;
				break;
			}
		}

		console.info("onReceivedProgress(): json starts: " + json_starts + " json_ends: " + json_ends);
		if ( ! found ) { json_ends = json_starts; break; }

		var json_str = _progress_buffer.substr(json_starts, (json_ends + 1 - json_starts));
		_progress_buffer = _progress_buffer.substr((json_ends + 1 - json_starts));

		var data = $.parseJSON(json_str);
		progressCallback(data)

		json_starts = json_ends + 1;
	}

	return json_ends;
}


function setupProgress(f_post, f_url, f_form_value) {
	console.info("setupProgress(): url: " + f_url);
	$('#contain_chapter').get(0).innerHTML = '';

	var timer = 1000, max_wait = 16000;
	var string_pos = 0;

	var request = new XMLHttpRequest();
	request.lengthReceived = 0;
	if ( f_post ) {
		request.open("POST", f_url);
		request.withCredentials = true;
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	}
	else {
		request.open("GET", f_url);
		request.withCredentials = true;
	}
	request.setRequestHeader("X-Response", "application/json");

	request.onreadystatechange = function() {
		var response = request.responseText;

		if (typeof request.readyState == "undefined") {
			var txt = response.substr(string_pos, response.length);
			string_pos = onReceivedProgress(request, txt);
			return;
		}

		// Load
		if (request.readyState == 3) {
			timer = 1000;

			// TODO: IE support for readyState 3.
			var txt = response.substring(request.lengthReceived);
			request.lengthReceived = response.length;

			console.info("setupProgress(): readyState: "
								+ request.readyState + " received: " + txt);
			onReceivedProgress(request, txt);
		}
		// The End
		else if (request.readyState == 4) {
			console.info("setupProgress(): readyState: "
							+ request.readyState + " received ended: " + request.status);
			if ( request.status == 401 ) {
				document.location = "/login/";
				return;
			}

			if ( timer < max_wait ) timer *= 2;
			console.info("setupProgress(): timer: " + timer);

			//setTimeout(function() { setupProgress(f_url); }, timer);
		}
	};

	request.send(f_form_value);
}


function runQAReport(f_form_node) {
	console.log('Form Submit: valid: ' + f_form_node.id);

	updateFormButton(true);
	var form_value = $('#' + f_form_node.id).serialize();
	setupProgress(true, f_form_node.action, form_value);
}


function initPage(f_running) {
	if ( f_running ) {
		updateFormButton(f_running);
		setupProgress(false, $('#checkform').get(0).action, null);
	}
	else {
		$('#run_button').get(0).disabled = false;
	}
}


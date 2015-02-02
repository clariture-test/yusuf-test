function Devices() {}
	Devices.prototype = options;

var devices = new Devices();

devices._select = function(row) {
    options._select.call(this, row);
};

devices._deselect = function(row) {
    options._deselect.call(this, row);
}

devices.clear_all = function() {
    options.clear_all.call(this);
}

function show_selected() {
	devices.show_selected();
}

function clear_all() {
	devices.clear_all();
}

function trend_1() {
	devices.submit('trend1_report');
}

function trend_2() {
	devices.submit('trend2_report');
}

function drive() {
	devices.submit('drive_report');
}


function re_run(carrier) {
	var url = window.location.href;
	url = url.substring(0, url.length - 1);
	url = url.substring(0, url.lastIndexOf('/') + 1);
	$("#select_form").attr("action", url);
	devices.submit(carrier);
}

function add_site(site_list) {
    $.post("/device/add/", { site_list: '[' + site_list + ']' }, function(data) {
    })
    .done(function() {
        location.reload();
    })
}


$(document).ready(function() {
	$("#reports").load("reports/");
	$('#select_devices').click(function(e){
	       var ks = $('#device_input').val().split("\n");
	       e.preventDefault();
	       $.each(ks, function(k){
	           if(ks[k] != '')
	           {
	               row = document.getElementById(ks[k]);
	               if(!row)
	                   alert(ks[k] + ' is not found!');
	               else
	                   devices.select(row);
	           }
	       });
	       $("#filter").focus();
	    });

    $('#site_add_button').click(function(e){
       var ks = $('#site_list').val().split("\n");
       $.each(ks, function(k){
            ks[k] = "'" + ks[k] + "'";
       });
       e.preventDefault();
       add_site(ks);
    });
	if(initials)
	{
		for(i=0; i<initials.length; i++)
			devices.select(document.getElementById(initials[i]));
		$("#search").focus();
	}
    $("#search").focus();
    
    $("#start_time").change(function () {
    	$('#end_time').data("DateTimePicker").setDate($('#start_time').data("DateTimePicker").getDate());
        $('#end_time').data("DateTimePicker").setMinDate($('#start_time').data("DateTimePicker").getDate());
    }); 
    devices.initialize();
});


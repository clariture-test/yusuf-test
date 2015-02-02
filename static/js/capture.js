var page = require("webpage").create();
var system = require("system");
var index = 0, loadInProgress = false;
var filename = system.args[3];
var id = system.args[2];
var limit = system.args.length > 4 ? system.args[4] : null;

page.onConsoleMessage = function(msg) {
	console.log(msg);
};

page.onLoadStarted = function() {
	loadInProgress = true;
};

page.onLoadFinished = function() {
	loadInProgress = false;
};

var url = system.args[1];

var steps = [ 

function() {
	page.open(url);
}, 

function() {
	page.evaluate(function() {
		var form = document.getElementById("form-login");

		form.elements["username"].value="admin";
		form.elements["password"].value="admin";
	});
},

function() {
	page.evaluate(function() {
		var form = document.getElementById("form-login");
		form.submit();
	});
},

function() {
	
	left = page.evaluate(function(id) {
		return document.getElementById(id).offsetLeft;
	}, id);
	
	top = page.evaluate(function(id) {
		return document.getElementById(id).offsetTop;
	}, id);
	
	width = page.evaluate(function(id) {
		return document.getElementById(id).offsetWidth;
	}, id);
	
	height = page.evaluate(function(id, limit) {
		var top_up = document.getElementById(id).offsetTop
		if(limit) {
			var elements = document.getElementsByClassName("check_no");
			var top_down = elements[limit].offsetTop;
			return top_down - top_up - 25;
		}
		else {
			return document.getElementById(id).offsetHeight;
		}
		
		
	}, id, limit);
},

function() {
	
	page.clipRect = {
			left : left,
			top : top,
			width : width,
			height : height
		};
	page.render(filename);
	phantom.exit();
}

];

interval = setInterval(function() {
	if (!loadInProgress && typeof steps[index] == "function") {
		steps[index]();
		index++;
	}
}, 10);

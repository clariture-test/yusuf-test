/*
Copyright (c) 2012-2014, Esmer Technologies, Inc. All Rights Reserved.

This source file is proprietary property of Esmer Technologies, Inc.
No part of this software or any of its contents may be reproduced, copied,
modified or adapted, without the prior written consent of the owner, unless
otherwise indicated for stand-alone materials.
*/

// globals: options, map

function Devices() {}
Devices.prototype = options;

var devices = new Devices();

devices._select = function(row) {
    options.clear_all()
    options._select.call(this, row);
    map.clear();
    map.select(row);
};

devices._deselect = function(row) {
    options._deselect.call(this, row);
    map.deselect(row);
}

function show_selected() {
    devices.show_selected()
}

function clear_all() {
    devices.clear_all()
    map.clear();
}


function assign_issue(issue_id, assignee) {
	$.post("assign/", {issue_id: issue_id, assignee: assignee}, function(data) {
    })
    .done(function() {
        $("#issues").load("list/");
    }) 
}

function delete_issue_assigned(issue_id) {
	$.post("delete/", { issue_id: issue_id }, function(data) {
    })
    .done(function() {
        $("#issues").load("list/");
    })
}

function response_issue(issue_id, response) {
	$.post("response/", { issue_id: issue_id, response: response }, function(data) {
    })
    .done(function() {
    	$("#issues").load("list/");
    })
}

function submit_create_issue(){
	var issue_type = "";
	var carrier = ""; 
	var device = $("#create_issue_label").text();
	var assignee = $("#assignee").val();
	var desc = $("#desc").val();
		
	$("input[name = 'name_issue_type']").each(function(){
		if($(this).is(':checked')) {
			issue_type += $(this).val() + ", ";
		}
	});
	
	var other = $("#issue_type_other").val();
	if(other) {
		issue_type += other;
	}
	else {
		issue_type = issue_type.slice(0, -2);
	}
	
	$("input[name = 'name_issue_carrier']").each(function(){
		if($(this).is(':checked')) {
			carrier += $(this).val() + ", ";
		}
	});
	if(carrier) {
		carrier = carrier.slice(0, -2);
	}
	
	$.post("create/", { device: device, issue_type: issue_type, carrier: carrier, assignee: assignee, desc: desc }, function(data) {
    })
    .done(function() {
    	$("#issues").load("list/");
    	clear_all();
    });
    hide_create_issue_modal();
}

function hide_create_issue_modal() {
	$("#create_issue_modal").modal("hide");
	$("#desc").val("")
	$("#issue_type_other").val("")
	$("input[name = 'name_issue_type']").each(function(){
		$(this).prop('checked', false);
	});
	$("input[name = 'name_issue_carrier']").each(function(){
		$(this).prop('checked', false);
	});
}

function append_selected_sites(select_form) {
	if (devices.selected.length) {
        for (name in devices.selected.hash) {
        	select_form.append('<input type="hidden" name="option_list" value="'+name+'" />')
        }
        return true;
	}
	return false;
}


function post_report(report_type) {
	var select_form = $("#select_form");
	select_flag = append_selected_sites(select_form);
	if (select_flag) {
		$("#action").val(report_type);
		$.post("/reports/", select_form.serialize(), function(data) {});
		clear_all();
	}
	else {
		$("#select_one").dialog({modal: true})
	}
}

function health_check() {
	post_report('H');
}

function trending_report() {
	var report_date = $("#id_report_date").val() + " 12:00 am"
	var valid = moment(report_date, 'MM/DD/YYYY hh:mm a', true).isValid(); 
	if(valid) {
		$("#trending_modal").modal("hide");
		$("#trending_date_error").hide();
		
	    var select_form = $("#select_form");
        select_form.append('<input type="hidden" name="start_time" value="'+report_date+'" />')
        
		var carrier = $("#carrier").val();
        select_form.append('<input type="hidden" name="carrier" value="'+carrier+'" />')
        
        post_report('TR');
	}
	else {
		$("#trending_date_error").show();
	}
}


function create_issue_modal() {
	if (devices.selected.length) {
		for (name in devices.selected.hash) {
			$("#create_issue_label").text(name);
			$.get("/network/sites/" + name + '/', function(data) {
				$("#site_detail_body").html(data);
			});
			
			$.get("/network/sites/weather/" + name + "/", function(data) {
				$("#weather_div").append(data);
			});
			
			$("#create_issue_modal").modal("show");
		}
	}
	else {
		$("#select_one").dialog({modal: true});
	}
	
}

/*** Copied from reports.js ***/

function trending_modal() {
	$("#trending_modal").modal("show")
}

function bulk_select_modal() {
    $("#search").focus()
}

/*** ***/

$(document).ready(function() {
	$("#issues").load("list/");
    /*** Copied from reports.js document ready ***/
    $('.form_datetime_trending').datetimepicker({
        pickTime: false,
        minDate: moment(),
        defaultDate: moment()
    });
	
	$('.form_datetime_drive').datetimepicker({
        minDate: moment()
    });
	/*** ***/
    devices.initialize();
    devices.update();
});

/*
Copyright (c) 2012-2014, Esmer Technologies, Inc. All Rights Reserved.

This source file is proprietary property of Esmer Technologies, Inc.
No part of this software or any of its contents may be reproduced, copied,
modified or adapted, without the prior written consent of the owner, unless
otherwise indicated for stand-alone materials.
*/

// globals: options, reports

function Devices() {}
Devices.prototype = options;

var devices = new Devices();

devices._select = function(row) {
    options._select.call(this, row);
    map.select(row);
};

devices._deselect = function(row) {
    options._deselect.call(this, row);
    map.deselect(row);
}

devices.update = function(str) {
    options.update.call(this, str);
    reports.update(str);
};

function show_selected() {
    devices.show_selected()
}

function clear_all() {
    devices.clear_all()
    map.clear();
}

function health_check() {
    devices.submit('H')
}

function short_check() {
    devices.submit('S')
}


function utran_report() {
	var report_date = $("#utran_report_date").val() + " 12:00 am";
	if(check_is_utran_date_valid(report_date)) {
		$("#utran_modal").modal("hide");
		
	    var select_form = $("#select_form");
	    select_form.append('<input type="hidden" name="start_time" value="'+report_date+'" />')
	    
		devices.submit('U');
	}
}

function trending_report() {
	var report_date = $("#trending_report_date").val() + " 12:00 am";
	if(check_is_trend_date_valid(report_date)) {
		$("#trending_modal").modal("hide");
		
	    var select_form = $("#select_form");
        select_form.append('<input type="hidden" name="start_time" value="'+report_date+'" />')
        
		var carrier = $("#trending_carrier").val();
        select_form.append('<input type="hidden" name="carrier" value="'+carrier+'" />')
        
		devices.submit('TR');
	}
}

function drive_report() {
	var start_time = $("#drive_start_time").val()
	var end_time = $("#drive_end_time").val()
	
	if(check_is_drive_dates_valid(start_time, end_time)) {
		$("#drive_modal").modal("hide");
		
	    var select_form = $("#select_form");
        select_form.append('<input type="hidden" name="start_time" value="'+start_time+'" />')
        select_form.append('<input type="hidden" name="end_time" value="'+end_time+'" />')
        
		var carrier = $("#drive_carrier").val();
        select_form.append('<input type="hidden" name="carrier" value="'+carrier+'" />')
        
		devices.submit('DR');
	}
}

function trending_modal() {
	$("#trending_modal").modal("show");
}

function drive_modal() {
	$("#drive_modal").modal("show");
}

function utran_modal() {
	$("#utran_modal").modal("show");
}

function close_bulk_select_modal() {
	$('#bulk_select_options').val("")
	$("#bulk_select_error").text("")
	$("#bulk_select_modal").modal("hide");
}

function bulk_select_modal() {
	$("#bulk_select_modal").modal("show");
}

function bulk_select() {
    not_found = devices.bulk_select($('#bulk_select_options').val())
    if (not_found.length > 0) {
    	$("#bulk_select_error").text(not_found.join(", ")+" not found");
    }
    else {
    	close_bulk_select_modal();
    }
}

function check_is_trend_date_valid(report_date) {
	if(!moment(report_date, 'MM/DD/YYYY hh:mm a', true).isValid()) {
		$('#trending_report_info').text("Please enter valid date");
		return false;
	}
	
	msg = "Report will start at " + report_date;
	$('#trending_report_info').text(msg);
	
	return true;
	
}

function check_is_drive_dates_valid(start_time, end_time) {
	
	var valid_start = moment(start_time, 'MM/DD/YYYY h:mm a', true).isValid(); 
	var valid_end = moment(end_time, 'MM/DD/YYYY h:mm a', true).isValid(); 
	
	if(!valid_start) {
		$("#drive_start_error").show();
		return false;
	}
	else if(!valid_end) {
		$("#drive_end_error").show();
		return false;
	}
	
	$("#drive_start_error").hide();
	$("#drive_end_error").hide();
	
	return true;
}

function check_is_utran_date_valid(report_date) {
	if(!moment(report_date, 'MM/DD/YYYY hh:mm a', true).isValid()) {
		$('#utran_report_info').text("Please enter valid date");
		return false;
	}
	
	msg = "Report will start at " + report_date;
	$('#utran_report_info').text(msg);
	
	return true;
}

$(document).ready(function() {
	var time = moment();
	var min_time = moment();
	
	if(time.hour() >= 2) {
		time.add(1, 'day');
	}
	else {
		min_time.subtract(1, 'day');
	}
	
	$('.form_datetime_trending').datetimepicker({
        pickTime: false,
        minDate: min_time,
        defaultDate: time
    });
	
	$('.form_datetime_drive').datetimepicker({
		minDate: moment(),
		defaultDate: moment()
    });
	
	$('.form_datetime_utran').datetimepicker({
		pickTime: false,
		minDate: min_time,
		defaultDate: time
    });
	
	
	$(".form_datetime_trending").on("dp.change",function (e) {
		var report_date = $("#trending_report_date").val() + " 12:00 am";
		check_is_trend_date_valid(report_date);
    });
	
	$(".form_datetime_utran").on("dp.change",function (e) {
		var report_date = $("#utran_report_date").val() + " 12:00 am";
		check_is_utran_date_valid(report_date);
    });
	
	$(".form_datetime_trending").on("dp.error",function (e) {
		$('#trending_report_info').text("Please enter valid date");
    });

	$(".form_datetime_utran").on("dp.error",function (e) {
		$('#utran_report_info').text("Please enter valid date");
    });
	
	
	var report_date = $("#trending_report_date").val() + " 12:00 am";
	check_is_trend_date_valid(report_date);
	var report_date = $("#utran_report_date").val() + " 12:00 am";
	check_is_utran_date_valid(report_date);
	
    devices.initialize();
    reports.update();
});

function create_pie_chart(div_id, title, subtitle, chart_data) {
	$(div_id).highcharts({
	    chart: {
	        plotBackgroundColor: null,
	        plotBorderWidth: null,
	        plotShadow: false
	    },
	    credits: {
	      enabled: false
		},
	    title: {
	        text: title,
	        x: -20 
	    },
	    colors: [
			 '#2f7ed8', 
			 '#910000', 
			 '#8bbc21', 
			 '#1aadce', 
			 '#492970',
			 '#f28f43', 
			 '#77a1e5', 
			 '#c42525', 
			 '#a6c96a'
	    ],
	    subtitle: {
	        text: subtitle,
	        x: -20
	    },
	    tooltip: {
		    pointFormat: '{point.name}: <b>{point.y}</b>'
	    },
	    plotOptions: {
	        pie: {
	            allowPointSelect: true,
	            cursor: 'pointer',
	            size:'65%',
	            dataLabels: {
	                enabled: true,
	                color: '#000000',
	                connectorColor: '#000000',
	                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
	            }
	        }
	    },
	    series: [{
	        type: 'pie',
	        name: title,
	        data: chart_data
	    }]
	});
}


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
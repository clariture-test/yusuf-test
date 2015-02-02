var chart;
var options;
$(document).ready(function(){
        options = new Highcharts.Chart(
           {
                chart: {
                    type: 'area',
                    renderTo: 'statschart'
                },
                credits: {
          	      enabled: false
          		},
                lang: {
                    exportToExcel: 'Export to excel'
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
                title: {
                    text: title,
                    x: -20 //center
                },
                subtitle: {
                    text: subtitle,
                    x: -20
                },
                xAxis: {
                    categories: data['Categories'],
                    tickmarPlacement: 'on',
                    title: {
                        enabled: false
                    }
                },
                yAxis: {
                    title: {
                        text: 'Report Count'
                    },
                    plotLines :[{
                        value: 0,
                        width: 1,
                        color:'#808080'
                    }],
                    min:0,
                    minRange: 0.1
                },
                tooltip: {
                    valueSuffix: ''
                },
                exporting: {
                    buttons: {
                        contextButton: {
                            enabled: false
                        },
                        customButton: {
                            enabled: excelEnabled,
                            symbol: 'url(/static/img/ico-excel.png)',
                            _titleKey: 'exportToExcel',
                            onclick: function () {
                                if(window.location.search)
                                {
                                    window.location.replace(window.location.href + "&excel=1")
                                }
                                else
                                {
                                    window.location.replace(window.location.href + cur_month +"&excel=1");
                                }
                            }
                        }
                    }
                },
                plotOptions: {
                    area: {
                        stacking:'normal',
                        lineWidth: 1,
                        marker: {
                            lineWidth: 1
                        }
                    }
                },
                series: [{
                    name:'Completed',
                    data: data['Completed']
                }, 
                {
                    name:'Failed',
                    data: data['Failed']
                }]
         });
});

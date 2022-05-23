
let chart;
window.addEventListener('load', function () {
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'chart',
            defaultSeriesType: 'spline',
            events: {
                load: requestData
            }
        },
        title: {
            text: 'Live random data for Temp and Humidity'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Value',
                margin: 80
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },
        series: [{
            name: 'Humdity',
            data: []
        }, {
            name: 'Temperature',
            data: []
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });
});

// chart = Highcharts.chart('container1', {

//     title: {
//         text: 'Line chart'
//     },

//     subtitle: {
//         text: 'subtitle'
//     },

//     yAxis: {
//         title: {
//             text: 'Value'
//         }
//     },

//     xAxis: {
//         categories: []
//     },

//     legend: {
//         layout: 'vertical',
//         align: 'right',
//         verticalAlign: 'middle'
//     },

//     plotOptions: {
//         series: {
//             label: {
//                 connectorAllowed: false
//             }
//         }
//     },
//     series: [{
//         name: 'Humdity',
//         data: []
//     }, {
//         name: 'Temperature',
//         data: []
//     }],

//     responsive: {
//         rules: [{
//             condition: {
//                 maxWidth: 500
//             },
//             chartOptions: {
//                 legend: {
//                     layout: 'horizontal',
//                     align: 'center',
//                     verticalAlign: 'bottom'
//                 }
//             }
//         }]
//     }
// });


/**
* Request data from the server, add it to the graph and set a timeout to request again
*/
async function requestData() {
    const result = await fetch('https://demo-live-data.highcharts.com/time-rows.json');
    if (result.ok) {
        const data = await result.json();
        const [date, value] = data[0];
        const point = [new Date(date).getTime(), value * 10];
        const series = chart.series[0],
            shift = series.data.length > 20; // shift if the series is longer than 20
        // add the point
        chart.series[0].addPoint(point, true, shift);

        const point2 = [new Date(date).getTime(), value * 15];
        const series2 = chart.series[1],
            shift2 = series2.data.length > 20; // shift if the series is longer than 20
        // add the point
        chart.series[1].addPoint(point2, true, shift2);
        // call it again after one second
        setTimeout(requestData, 5000);
    }
}

setTimeout(async () => {
    const result = await fetch('https://zuyvro6601.execute-api.eu-central-1.amazonaws.com/default/IIoTLambdaApiMicroservice?TableName=IIoTDataStorag');
    console.log(result.json());
}, 5000)

// let getData = function () {
//     // $.ajax({
//     //     type: "GET",
//     //     dataType: "json",
//     //     async: false,
//     //     success: function (data) {
//     //         console.log('data', data);
//     //         drawChart(data);
//     //     },
//     //     error: function (xhr, status, error) {
//     //         console.error("JSON error: " + status);
//     //     }
//     // });
//     drawChart(null);
// }

// let drawChart = function (data) {

//     humArr = [1, 2, 3, 4, 5, 4, 3, 2, 1];
//     tempArr = [2, 4, 5, 6, 5, 4, 3, 2, 1];
//     upArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

//     myChart.series[0].setData(humArr, true)
//     myChart.series[1].setData(tempArr, true)
// }

// document.addEventListener("DOMContentLoaded", () => {
//     console.log("DOM Loaded, Getting Chart Data")
//     getData();
// });

// const refreshInterval = 5 * 1000; // refresh every 5000 ms
// setInterval(() => {
//     console.log("Refreshing Chart Data")
//     getData();
// }, refreshInterval);


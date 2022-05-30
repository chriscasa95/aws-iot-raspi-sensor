import { availableDevices, getData, transformData } from "./data.js";

const refreshInterval = 2000
let currentDeviceId = 'C3';
let lastRecievedTimestamp = 0;
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

/**
* Request data from the server, add it to the graph and set a timeout to request again
*/
async function requestData() {
    sensorSelection();
    const data = await getData(currentDeviceId, lastRecievedTimestamp)
    const plotData = await transformData(data);
    // get last element of the timestamp array plotData[0] = [ts1, ts2, ..., tsn]
    // update lastRecievedTimestamp if array has length of more than 0
    lastRecievedTimestamp = plotData[0].length ? plotData[0][plotData[0].length - 1] / 1000 : lastRecievedTimestamp;
    console.log(plotData, "\nNew lasrRcTs: ", lastRecievedTimestamp);

    for (const [idx, ts] of plotData[0].entries()) {
        const point = [ts, plotData[1][idx]];
        const series = chart.series[0],
            shift = series.data.length > 20; // shift if the series is longer than 20
        // add the point
        chart.series[0].addPoint(point, true, shift);

        const point2 = [ts, plotData[2][idx]];
        const series2 = chart.series[1],
            shift2 = series2.data.length > 20; // shift if the series is longer than 20
        // add the point
        chart.series[1].addPoint(point2, true, shift2);
    }
    // call it again after one second
    setTimeout(requestData, refreshInterval);
}

async function sensorSelection() {
    const urlParams = new URLSearchParams(window.location.search);
    const deviceIdParam = urlParams.get('device_id');
    if (currentDeviceId == deviceIdParam) {
        return;
    }
    if (availableDevices.indexOf(deviceIdParam) >= 0) {
        currentDeviceId = deviceIdParam;
        lastRecievedTimestamp = 0;
        document.getElementById('dropdownMenuLink').innerHTML = "Sensors | <b>" + currentDeviceId + "</b>";
    }
}

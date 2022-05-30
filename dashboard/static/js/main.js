import { availableDevices, getData, transformData, transformDataPoints } from "./data.js";

const refreshInterval = 10*1000;
const graphPointLimit = 20;
const graphTimespan = 60*60*12;
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
            text: ''
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
            name: 'Temperature',
            data: []
        }, {
            name: 'Humidity',
            data: []
        }, {
            name: 'PM2.5',
            data: []
        }, {
            name: 'PM10',
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
    //const data = await getData(currentDeviceId, lastRecievedTimestamp);
    //const plotData = await transformData(data, graphPointLimit, 20);

    const data = await getData(currentDeviceId, (new Date().getTime() / 1000) - graphTimespan);
    const newPD = await transformDataPoints(data, graphPointLimit, 20);

    // get last element of the timestamp array plotData[0] = [ts1, ts2, ..., tsn]
    // update lastRecievedTimestamp if array has length of more than 0
    //lastRecievedTimestamp = plotData[0].length ? plotData[0][plotData[0].length - 1] / 1000 : lastRecievedTimestamp;
    //console.log("\nNew lasrRcTs: ", lastRecievedTimestamp);

    chart.series[0].setData(newPD[0], true);
    chart.series[1].setData(newPD[1], true);
    chart.series[2].setData(newPD[2], true);
    chart.series[3].setData(newPD[3], true);
    chart.redraw(true);

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

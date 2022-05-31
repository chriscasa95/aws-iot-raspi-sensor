import { availableDevices, getData, transformData } from './data.js';

let lastRecievedTimestamp = Math.round(new Date().getTime() / 1000) - 60 * 60 * 24;

var map = L.map('map').setView([47.679006, 9.162831], 14);

var last_marker = null;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '© OpenStreetMap',
}).addTo(map);

const dataModal = new bootstrap.Modal(document.getElementById('dataModal'), {
	keyboard: false,
});

document.getElementById('dataModelButton').addEventListener('click', buttonClicked);

async function init() {
	for (const device in availableDevices) {
		const data = await getData(availableDevices[device], lastRecievedTimestamp);
		console.log(data);

		if (data.Items.length > 0) {
			const lat = data.Items[0].lat;
			const long = data.Items[0].long;
			const device_id = data.Items[0].device_id;

			L.marker([long, lat], { device_id: device_id })
				.addTo(map)
				// .on('mouseover', on_mouseover)
				.on('click', on_click);
		}
	}
}

async function on_click(e) {
	const data = await getData(e.target.options.device_id, lastRecievedTimestamp);
	const plotData = await transformData(data);

	console.log(plotData);

	document.getElementById('dataModal').style.marginTop = e.containerPoint.y - 200;
	document.getElementById('dataModal').style.marginLeft = e.containerPoint.x - 320;

	document.getElementById('dataModalHeader').innerHTML = e.target.options.device_id;

	document.getElementById('dataModalBody').innerHTML = `<table class="table">
	<thead>
	  <tr>
		<th scope="col">#</th>
		<th scope="col">Name</th>
		<th scope="col">Value</th>
		<th scope="col">Unit</th>
	  </tr>
	</thead>
	<tbody>
	  <tr>
		<th scope="row">1</th>
		<td>Temperature</td>
		<td>${plotData[1].slice(-1)}</td>
		<td>°C</td>
	  </tr>
	  <tr>
		<th scope="row">2</th>
		<td>Humidity</td>
		<td>${plotData[2].slice(-1)}</td>
		<td>%</td>
	  </tr>

	  <tr>
		<th scope="row">3</th>
		<td>PM2.5</td>
		<td>${plotData[3].slice(-1)}</td>
		<td>µg/m³</td>
	</tr>
	<tr>
	<th scope="row">4</th>
	<td>PM10</td>
	<td>${plotData[4].slice(-1)}</td>
	<td>µg/m³</td>
  </tr>
	</tbody>
  </table>`;
	console.log(dataModal._isShown);
	dataModal.show();

	last_marker = e;
}

async function buttonClicked() {
	window.location.href = `./index.html?device_id=${last_marker.target.options.device_id}`;
}

init();

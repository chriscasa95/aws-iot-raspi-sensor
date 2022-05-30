import { availableDevices, getData, transformData } from './data.js';

let lastRecievedTimestamp = 0;

var map = L.map('map').setView([47.679006, 9.162831], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '© OpenStreetMap',
}).addTo(map);

const dataModal = new bootstrap.Modal(document.getElementById('dataModal'), {
	keyboard: false,
});

async function init() {
	for (const device in availableDevices) {
		const data = await getData(availableDevices[device], lastRecievedTimestamp);
		console.log(data);

		if (data.Items.length > 0) {
			const lat = data.Items[0].lat;
			const long = data.Items[0].long;
			const device_id = data.Items[0].device_id;

			L.marker([lat, long], { device_id: device_id })
				.addTo(map)
				.on('mouseover', on_mouseover)
				.on('click', on_click);
		}
	}
}

async function on_mouseover(e) {
	console.log(e);
	const data = await getData(e.target.options.device_id, lastRecievedTimestamp);
	const plotData = await transformData(data);

	console.log(plotData);
	dataModal.show();
	document.getElementById('dataModal').style.marginTop = e.containerPoint.y - 50;
	document.getElementById('dataModal').style.marginLeft = e.containerPoint.x - 320;
	console.log(document.getElementById('dataModal').style);

	document.getElementById('dataModalHeader').innerHTML = e.target.options.device_id;
	document.getElementById('dataModalBody').innerHTML = e.target.options.device_id;
}

async function on_click(e) {
	// console.log(e.target.options);
	window.location.href = `/dashboard/static/index.html?device_id=${e.target.options.device_id}`;
}

init();

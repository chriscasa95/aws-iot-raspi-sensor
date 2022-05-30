export const dataApiUrl = 'https://zuyvro6601.execute-api.eu-central-1.amazonaws.com/default/IIoTLambdaApiMicroservice';

export const availableDevices = ['C3', 'HTWG', 'Uni']

export async function getData(currentDeviceId, lastRecievedTimestamp) {
    let url = new URL(dataApiUrl);
    let params = { device_id: currentDeviceId, start_timestamp: lastRecievedTimestamp };
    url.search = new URLSearchParams(params).toString();

    let data = { Items: [] };
    const result = await fetch(url);
    if (result.ok) {
        data = await result.json();
    }
    return data;
}

export async function transformData(data) {
    console.log(data)
    const plotData = data.Items.reduce((acc, item) => {
        if (item.timestamp) {
            acc[0].push(new Date(item.timestamp * 1000).getTime());
            acc[1].push(isNaN(item.temperature) ? null : item.temperature);
            acc[2].push(isNaN(item.humidity) ? null : item.humidity);
            acc[3].push(isNaN(item.pm2_5) ? null : item.pm2_5);
            acc[4].push(isNaN(item.pm10) ? null : item.pm10);
        }
        return acc;
    }, [[], [], [], [], []]); // initialize array of arrays for arr[0] => timestamps, arr[1] => temperature, arr[2] => humidity
    return plotData;
}

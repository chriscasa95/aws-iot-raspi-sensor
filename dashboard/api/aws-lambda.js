const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers" : "Content-Type",
        //"Access-Control-Allow-Origin": "http://iiot-dashboard.s3-website.eu-central-1.amazonaws.com",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    };
    
    try {
        switch (event.requestContext.http.method) {
            case 'GET':
                const device_id = event.queryStringParameters.device_id;
                let start_timestamp = parseInt(event.queryStringParameters.start_timestamp);
                if (!start_timestamp) {
                    start_timestamp = 0
                }
                const params = {
                    KeyConditionExpression: 'device_id = :id AND #ts > :ts',
                    ExpressionAttributeValues: {
                    ':id': device_id,
                    ':ts': start_timestamp
                    },
                    ExpressionAttributeNames: {"#ts": "timestamp"},
                    TableName: "iiot-sensor-data",
                };
                const result = await dynamo.query(params).promise()
                body = result;
                break;
            case 'POST':
                break;
            case 'OPTIONS':
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};

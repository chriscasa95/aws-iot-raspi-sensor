from time import sleep
from awscrt import mqtt
from awsiot import mqtt_connection_builder

import argparse
import os, sys

from sensor.Sensor import Sensor

# Read in command-line parameters
parser = argparse.ArgumentParser()
parser.add_argument(
    "-e",
    "--endpoint",
    action="store",
    required=True,
    dest="endpoint",
    help="Your AWS IoT custom endpoint",
)
parser.add_argument(
    "-r",
    "--rootCA",
    action="store",
    required=True,
    dest="rootCAPath",
    help="Root CA file path",
)
parser.add_argument(
    "-c", "--cert", action="store", dest="certificatePath", help="Certificate file path"
)
parser.add_argument(
    "-k", "--key", action="store", dest="privateKeyPath", help="Private key file path"
)
parser.add_argument(
    "-p", "--port", action="store", dest="port", type=int, help="Port number override"
)
# parser.add_argument("-w", "--websocket", action="store_true", dest="useWebsocket", default=False,
#                     help="Use MQTT over WebSocket")
parser.add_argument(
    "-id",
    "--clientId",
    action="store",
    dest="clientId",
    default="basicPubSub",
    help="Targeted client id",
)
parser.add_argument(
    "-t",
    "--topic",
    action="store",
    dest="topic",
    default="data",
    help="Targeted topic",
)

args = parser.parse_args()

endpoint = args.endpoint
# host = args.host
rootCAPath = args.rootCAPath
certificatePath = args.certificatePath
privateKeyPath = args.privateKeyPath
port = args.port
# useWebsocket = args.useWebsocket
clientId = args.clientId
topic = args.topic

# Callback when connection is accidentally lost.
def on_connection_interrupted(connection, error, **kwargs):
    print("Connection interrupted. error: {}".format(error))


# Callback when an interrupted connection is re-established.
def on_connection_resumed(connection, return_code, session_present, **kwargs):
    print(
        "Connection resumed. return_code: {} session_present: {}".format(
            return_code, session_present
        )
    )

    if return_code == mqtt.ConnectReturnCode.ACCEPTED and not session_present:
        print("Session did not persist. Resubscribing to existing topics...")
        resubscribe_future, _ = connection.resubscribe_existing_topics()

        # Cannot synchronously wait for resubscribe result because we're on the connection's event-loop thread,
        # evaluate result with a callback instead.
        resubscribe_future.add_done_callback(on_resubscribe_complete)


def on_resubscribe_complete(resubscribe_future):
    resubscribe_results = resubscribe_future.result()
    print("Resubscribe results: {}".format(resubscribe_results))

    for topic, qos in resubscribe_results["topics"]:
        if qos is None:
            sys.exit("Server rejected resubscribe to topic: {}".format(topic))


# Callback when the subscribed topic receives a message
def on_message_received(topic, payload, dup, qos, retain, **kwargs):
    print("Received message from topic '{}': {}".format(topic, payload))
    global received_count
    received_count += 1
    # if received_count == cmdUtils.get_command("count"):
    #     received_all_event.set()


def build_direct_mqtt_connection(on_connection_interrupted, on_connection_resumed):

    return mqtt_connection_builder.mtls_from_path(
        endpoint=endpoint,
        port=8883,
        cert_filepath=certificatePath,
        ca_filepath=rootCAPath,
        pri_key_filepath=privateKeyPath,
        on_connection_interrupted=on_connection_interrupted,
        on_connection_resumed=on_connection_resumed,
        client_id=clientId,
        clean_session=False,
        keep_alive_secs=6,
    )


if __name__ == "__main__":

    __DEVICE_ID = os.environ.get("DEVICE_ID")
    __LONG = float(os.environ.get("LAT"))
    __LAT = float(os.environ.get("LONG"))

    print(__DEVICE_ID)
    print(__LONG)
    print(__LAT)

    mqtt_connection = build_direct_mqtt_connection(
        on_connection_interrupted, on_connection_resumed
    )

    connect_future = mqtt_connection.connect()

    # Future.result() waits until a result is available
    connect_future.result()
    print("Connected!")

    i = 0
    sensor = Sensor(lat=__LAT, long=__LONG, device_id=__DEVICE_ID)

    while True:

        sleep(1)

        data = sensor.measure().json
        # print(data)

        if i % 30 == 0:

            mqtt_connection.publish(
                topic=topic, payload=data, qos=mqtt.QoS.AT_LEAST_ONCE
            )

        i = i + 1

    # Disconnect
    print("Disconnecting...")
    disconnect_future = mqtt_connection.disconnect()
    disconnect_future.result()
    print("Disconnected!")

printf "\nRunning pub/sub sample application...\n"

# SDK 1
# python aws-iot-device-sdk-python/samples/basicPubSub/basicPubSub.py -e a27oynsxnin6nw-ats.iot.eu-central-1.amazonaws.com -r keys/root-CA.crt -c keys/test_thing.cert.pem -k keys/test_thing.private.key

# SDK 2 samples
# python ../aws-iot-samples/pubsub.py --endpoint a27oynsxnin6nw-ats.iot.eu-central-1.amazonaws.com --ca_file keys/root-CA.crt --cert keys/test_thing.cert.pem --key keys/test_thing.private.key  --client_id basicPubSub

# SDK2 own
python ./test.py -e a27oynsxnin6nw-ats.iot.eu-central-1.amazonaws.com -r keys/root-CA.crt -c keys/test_thing.cert.pem -k keys/test_thing.private.key -id basicPubSub


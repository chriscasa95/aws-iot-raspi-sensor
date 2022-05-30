#!/bin/bash

pip3 install gpiozero
pip3 install awsiotsdk
pip3 install awscrt
pip3 install awsiot

python3 ./aws-iot/test.py -e a27oynsxnin6nw-ats.iot.eu-central-1.amazonaws.com -r ./aws-iot/keys/root-CA.crt -c ./aws-iot/keys/test_thing.cert.pem -k ./aws-iot/keys/test_thing.private.key -id basicPubSub
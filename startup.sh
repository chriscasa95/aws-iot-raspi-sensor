#!/bin/bash

pipenv install
pipenv run python ./aws-iot/test.py -e a27oynsxnin6nw-ats.iot.eu-central-1.amazonaws.com -r ./aws-iot/keys/root-CA.crt -c ./aws-iot/keys/test_thing.cert.pem -k ./aws-iot/keys/test_thing.private.key -id basicPubSub
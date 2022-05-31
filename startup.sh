#!/bin/bash

pip3 install gpiozero
pip3 install pytz
pip3 install awsiotsdk
pip3 install awscrt
pip3 install awsiot

python3 ./aws-iot/main.py -e a27oynsxnin6nw-ats.iot.eu-central-1.amazonaws.com -r ./aws-iot/keys/root-CA.crt -c ./aws-iot/keys/certificate.crt -k ./aws-iot/keys/private.key
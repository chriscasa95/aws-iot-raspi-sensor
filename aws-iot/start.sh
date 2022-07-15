printf "\nRunning pub/sub sample application...\n"

export DEVICE_ID="Schaenzlebruecke"
export LAT="47.673468"
export LONG="9.157934"

python ./main.py -e a27oynsxnin6nw-ats.iot.eu-central-1.amazonaws.com -r keys/root-CA.crt -c keys/certificate.crt -k keys/private.key


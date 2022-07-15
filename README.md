# Run project as dev
    # create keys folder
    mkdir keys

Copy AWS IoT client keys and certificates into the `keys` folder. With the naming scheme: 

- Device certificate: `cerificate.crt`
- Device private.key: `private.key`
- Server certificate: `root-CA.crt`


Then:
    
    # install pipenv
    pipenv install

    # activate shell
    pipenv shell

    # (optional) change ENV vars in start scipt
    # for example:
    # export DEVICE_ID="Schaenzlebruecke"
    # export LAT="47.673468"
    # export LONG="9.157934"

    # run start script
    ./aws-iot/start.sh


# Run project on Raspi
    # create keys folder
    mkdir keys

Copy AWS IoT client keys and certificates into the `keys` folder. With the naming scheme: 

- Device certificate: `cerificate.crt`
- Device private.key: `private.key`
- Server certificate: `root-CA.crt`


Create `sensor_vars.env` file in the `keys` folder.
File should look like this:

    DEVICE_ID=Zaehringerplatz
    LAT=47.667558
    LONG=9.179454

Than install or enable `sensor.service`. This can for example be done by using the `firstrun.sh` script at the first boot. This shellscript is viewable in the `raspi` folder.

# For website details ...
... take a look at the `dashboard` folder.

# Important

Do not check keys into git!!

  
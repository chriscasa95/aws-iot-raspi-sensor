#!/bin/bash

set +e

CURRENT_HOSTNAME=`cat /etc/hostname | tr -d " \t\n\r"`
echo sensorpi >/etc/hostname
sed -i "s/127.0.1.1.*$CURRENT_HOSTNAME/127.0.1.1\tsensorpi/g" /etc/hosts
FIRSTUSER=`getent passwd 1000 | cut -d: -f1`
FIRSTUSERHOME=`getent passwd 1000 | cut -d: -f6`
install -o "$FIRSTUSER" -m 700 -d "$FIRSTUSERHOME/.ssh"
install -o "$FIRSTUSER" -m 600 <(printf "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDbvB0AarKvcEqp5RJ/d6lhQv3M4N/8jroUWLa0JE3lO for_raspi") "$FIRSTUSERHOME/.ssh/authorized_keys"
echo 'PasswordAuthentication no' >>/etc/ssh/sshd_config
systemctl enable ssh
cat >/etc/wpa_supplicant/wpa_supplicant.conf <<'WPAEOF'
country=DE
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
ap_scan=1

update_config=1
network={
	scan_ssid=1
	ssid="WLAN-437200"
	psk=f8a6b074ac2f38aa1de3b5a106b786a975448bf02a6e9dd89541ceb79ff4fbf9
}

WPAEOF
chmod 600 /etc/wpa_supplicant/wpa_supplicant.conf
rfkill unblock wifi
for filename in /var/lib/systemd/rfkill/*:wlan ; do
  echo 0 > $filename
done
rm -f /etc/localtime
echo "Europe/Berlin" >/etc/timezone
dpkg-reconfigure -f noninteractive tzdata
cat >/etc/default/keyboard <<'KBEOF'
XKBMODEL="pc105"
XKBLAYOUT="de"
XKBVARIANT=""
XKBOPTIONS=""

# install
apt update -y
apt install git -y
# apt install pipenv -y

# create folder
mkdir /home/pi/code
#clone git repro
git clone https://github.com/chriscasa95/aws-iot-raspi-sensor.git /home/pi/code

# copy keys and service file
cp -r /boot/keys /home/pi/code/aws-iot
cp /home/pi/code/sensor.service /etc/systemd/system/sensor.service

# start system deamon
systemctl start sensor.service
systemctl enable sensor.service

# delete keys folder
rm -r /boot/keys

KBEOF
dpkg-reconfigure -f noninteractive keyboard-configuration
rm -f /boot/firstrun.sh
sed -i 's| systemd.run.*||g' /boot/cmdline.txt
exit 0

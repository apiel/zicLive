## rpiwpafix.txt

```sh
sudo vim /etc/network/interfaces
```

add

```
allow-hotplug wlan0
iface wlan0 inet manual
wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
```

then

```sh
sudo systemctl enable wpa_supplicant.service
sudo reboot now
```

**or**

```sh
sudo echo 'allow-hotplug wlan0' >> /etc/network/interfaces
sudo echo 'iface wlan0 inet manual' >> /etc/network/interfaces
sudo echo 'wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf' >> /etc/network/interfaces
sudo systemctl enable wpa_supplicant.service
sudo reboot now
```

**or for SD card creation**

```sh
sudo echo 'allow-hotplug wlan0' >> /media/alex/rootfs/etc/network/interfaces
sudo echo 'iface wlan0 inet manual' >> /media/alex/rootfs/etc/network/interfaces
sudo echo 'wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf' >> /media/alex/rootfs/etc/network/interfaces
```

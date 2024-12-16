#!/bin/bash

# Mettre à jour le système
sudo apt update

# Installer Mosquitto (MQTT broker) et les clients
sudo apt install -y mosquitto mosquitto-clients
sudo systemctl enable mosquitto
sudo systemctl start mosquitto

# Installer Redis
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Installer Python et pip (si non installé)
sudo apt install -y python3 python3-pip

# Installer les bibliothèques Python nécessaires
pip3 install paho-mqtt redis influxdb

echo "Installation de Mosquitto, Redis, Python, pip et des bibliothèques Python terminée." 
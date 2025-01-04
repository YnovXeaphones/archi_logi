#!/bin/sh

echo "Lancement de l'installation"

# Mettre à jour les index des paquets
apk update

# Installer Redis
#apk add redis
#rc-update add redis default
#rc-service redis start

# Installer Python et pip
apk add python3 py3-pip jq

# Créer un environnement virtuel Python car sinon interdis d'installer
python3 -m venv /venv
source /venv/bin/activate

# Installer les bibliothèques Python nécessaires
pip install paho-mqtt redis influxdb

echo "Installation de Mosquitto, Redis, Python, pip et des bibliothèques Python terminée. :)"

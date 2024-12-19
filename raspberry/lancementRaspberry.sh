#!/bin/bash

#envoyer regiter a l'api

if [ -f /usr/local/bin/install_script.sh ]; then
    echo "Lancement de install_script.sh..."
    bash /usr/local/bin/install_script.sh
else
    echo "Erreur : /usr/local/bin/install_script.sh introuvable."
    exit 1
fi
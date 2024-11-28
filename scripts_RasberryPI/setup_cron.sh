#!/bin/bash

# Chemin vers le script à exécuter
SCRIPT_PATH="./ping_script.sh"
LOG_PATH="../logs/ping.log"

# Fréquence du cron job (ici toutes les 5 minutes)
CRON_JOB="*/5 * * * * $SCRIPT_PATH >> $LOG_PATH 2>&1"

# Vérifier si le cron job est déjà présent
(crontab -l 2>/dev/null | grep -F "$SCRIPT_PATH") >/dev/null

if [ $? -eq 0 ]; then
    echo "Le cron job existe déjà."
else
    # Ajouter le cron job au crontab de l'utilisateur
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "Cron job ajouté : $CRON_JOB"
fi

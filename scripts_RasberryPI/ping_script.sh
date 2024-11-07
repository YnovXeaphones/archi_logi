#!/bin/bash

# URL de l'API
URL="https://api.airnet.com/ping"

# Fonction pour envoyer le ping
send_ping() {
    RESPONSE=$(curl --silent --write-out "%{http_code}" --output /dev/null -X POST "$URL")

    # Vérifier que la réponse est OK (200)
    if [ "$RESPONSE" == "200" ]; then
        echo "$(date) - Ping réussi, last_ping mis à jour avec succès."
    else
        echo "$(date) - Erreur de mise à jour, code réponse $RESPONSE"
    fi
}

# Exécution toutes les X minutes (par exemple, 5 minutes)
while true; do
    send_ping
    sleep 300  # 300 secondes = 5 minutes
done

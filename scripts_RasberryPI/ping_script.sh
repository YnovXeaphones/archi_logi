#!/bin/bash

# Aller dans le répertoire du script
cd "$(dirname "$0")"

# Définir le PATH pour cron
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

# Récupération de l'adresse MAC de la machine
MAC_ADDRESS=$(ip link show | awk '/ether/ {print $2; exit}')
if [ -z "$MAC_ADDRESS" ]; then
    echo "Erreur : Impossible de récupérer l'adresse MAC."
    exit 1
fi
echo "Adresse MAC détectée : $MAC_ADDRESS"

URL="http://api.localhost/ping"

# Fonction pour envoyer le ping
send_ping() {
    # Envoi de la requête avec l'adresse MAC fournie
    RESPONSE=$(curl --silent --write-out "\nHTTP_STATUS:%{http_code}" -X POST "$URL" \
        -H "Content-Type: application/json" \
        -d "{\"mac\": \"$MAC_ADDRESS\"}")

    # Séparation du corps de la réponse et du code HTTP
    HTTP_BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS:.*//g')
    HTTP_STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

    # Logs détaillés
    echo "$(date) - Corps de la réponse : $HTTP_BODY"
    echo "$(date) - Code de statut HTTP : $HTTP_STATUS"

    # Vérification du code de statut HTTP
    if [ "$HTTP_STATUS" == "200" ]; then
        echo "$(date) - Ping réussi, last_ping mis à jour avec succès."
    else
        echo "$(date) - Erreur de mise à jour, code réponse $HTTP_STATUS"
        echo "$(date) - Message d'erreur : $HTTP_BODY"
    fi
}

# Appel de la fonction
send_ping

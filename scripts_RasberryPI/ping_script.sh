#!/bin/bash

# URL de l'API
URL="http://api.localhost/ping"

# Fonction pour envoyer le ping
send_ping() {
    # Envoi de la requête et capture de la réponse complète et du code de statut HTTP
    RESPONSE=$(curl --silent --write-out "\nHTTP_STATUS:%{http_code}" -X POST "$URL" -H "Content-Type: application/json" -d '{"mac": "00:11:22:33:44:55"}')

    # Séparation de la partie corps de la réponse et du code HTTP
    HTTP_BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS:.*//g')
    HTTP_STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

    # Logs détaillés pour afficher la réponse complète et le code HTTP
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

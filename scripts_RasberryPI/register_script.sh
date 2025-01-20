#!/bin/bash

# URL de l'API
API_URL="http://api.localhost/register"

# Récupération de l'adresse MAC de la machine
MAC_ADDRESS=$(ip link show | awk '/ether/ {print $2; exit}')
if [ -z "$MAC_ADDRESS" ]; then
    echo "Erreur : Impossible de récupérer l'adresse MAC."
    exit 1
fi
echo "Adresse MAC détectée : $MAC_ADDRESS"

# Vérification et récupération de la clé SSH
SSH_KEY_PATH="$HOME/.ssh/id_rsa.pub"
if [ ! -f "$SSH_KEY_PATH" ]; then
    echo "Clé SSH non trouvée, création d'une nouvelle paire de clés SSH..."
    ssh-keygen -t rsa -b 4096 -f "$HOME/.ssh/id_rsa" -N ""
fi
SSH_KEY=$(cat "$SSH_KEY_PATH")
echo "Clé SSH récupérée."

# Effectuer une requête POST à l'API
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{\"mac\": \"$MAC_ADDRESS\", \"sshkey\": \"$SSH_KEY\"}")

# Séparation de la réponse et du code HTTP
HTTP_BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS:.*//g')
HTTP_STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

# Logs
echo "$(date) - Corps de la réponse : $HTTP_BODY"
echo "$(date) - Code de statut HTTP : $HTTP_STATUS"

# Vérification du code HTTP
if [ "$HTTP_STATUS" == "200" ]; then
    echo "$(date) - Maison ajoutée avec succès."
else
    echo "$(date) - Erreur lors de l'ajout de la maison. Code : $HTTP_STATUS"
    echo "$(date) - Message d'erreur : $HTTP_BODY"
fi

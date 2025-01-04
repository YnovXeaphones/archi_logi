#!/bin/bash

echo "Début du script"

set -euo pipefail

# Fonction pour envoyer le ping
send_ping() {
    while true; do
        RESPONSE=$(curl --silent --write-out "%{http_code}" --output /dev/null -X POST "https://api.airnet.com/ping")
        
        # Vérifier que la réponse est OK (200)
        if [ "$RESPONSE" == "200" ]; then
            echo "$(date) - Ping réussi, last_ping mis à jour avec succès."
        else
            echo "$(date) - Erreur de mise à jour, code réponse $RESPONSE"
        fi
        sleep 6
    done
}

# Fonction pour récupérer la configuration
retrieve_config() {
    mac="00:01:02:03:04:05"
    sshkey="ssh-rsa AAAAB3...?..."
    json_data="{\"mac\": \"$mac\", \"sshkey\": \"$sshkey\"}"
    api_url="http://localhost:3000/register"

    temp_body=$(mktemp)
    http_code=$(curl -s -o "$temp_body" -w "%{http_code}" -X POST "$api_url" -H "Content-Type: application/json" -d "$json_data")
    response_body=$(cat "$temp_body")
    rm -f "$temp_body"

    if [ $http_code -eq 200 ]; then
        echo "Requête envoyée avec succès !"
        echo "Réponse de l'API : $response_body"
        SSH_PORT=$(echo $response_body | jq -r '.ssh_port')
        BUCKET_NAME=$(echo $response_body | jq -r '.bucket_name')
        BUCKET_ADDRESS=$(echo $response_body | jq -r '.bucket_address')
    else
        echo "Erreur de communication avec l'API : $response_body"
        exit 1
    fi
}

echo "Lancement de Docker Compose..."
docker-compose up -d

echo "Vérification de l'existence de /usr/local/bin/install_script.sh"
# Exécution du script
if [ -f /usr/local/bin/install_script.sh ]; then
    echo "Lancement de install_script.sh..."
    bash /usr/local/bin/install_script.sh

    retrieve_config

    send_ping &

    echo "Ouverture de la connexion SSH..."
    ssh -p $SSH_PORT user@remote_host

    
else
    echo "Erreur dans l'installation"
    exit 1
fi

echo "Fin du script"
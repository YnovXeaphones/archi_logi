#!/bin/bash

echo "Début du script"

set -euo pipefail

get_mac_address() {
    local default_iface
    default_iface=$(ip route show default 2>/dev/null | awk '/default/ {print $5}' )

    local mac_addr
    mac_addr=$(ip link show "$default_iface" 2>/dev/null | awk '/ether/ {print $2}')
    
    # Alternatively, you could use ifconfig (older systems):
    # ifconfig eth0 2>/dev/null | awk '/ether/ {print $2}'

    echo "$mac_addr"
}

get_ssh_key() {
    local key_path="${HOME}/.ssh/id_rsa"
    local pub_key_path="${HOME}/.ssh/id_rsa.pub"
    
    # Check if the private key doesn't exist
    if [[ ! -f "${key_path}" ]]; then
        ssh-keygen -t rsa -b 4096 -f "${key_path}" -N ""
        cat "${pub_key_path}"
    else
        cat "${pub_key_path}"
    fi
}

# Fonction pour envoyer le ping
send_ping() {
    while true; do
        mac=$(get_mac_address)
        json_data="{\"mac\": \"$mac\"}"
        RESPONSE=$(curl --silent --write-out "%{http_code}" --output /dev/null -X POST "http://localhost:3000/ping" -H "Content-Type: application/json" -d "$json_data")
        
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
    mac=$(get_mac_address)
    sshkey=$(get_ssh_key)
    json_data="{\"mac\": \"$mac\", \"sshkey\": \"$sshkey\"}"
    api_url="http://localhost:3000/register"

    echo "$json_data"

    temp_body=$(mktemp)
    http_code=$(curl -s -o "$temp_body" -w "%{http_code}" -X POST "$api_url" -H "Content-Type: application/json" -d "$json_data")
    response_body=$(cat "$temp_body")
    rm -f "$temp_body"

    if [ $http_code -eq 200 ]; then
        echo "Requête envoyée avec succès !"
        echo "Réponse de l'API : $response_body"
        
        # Récupération des données
        ssh_port=$(echo "$response_body" | jq -r '.message.ports[80]')
        bucket=$(echo "$response_body" | jq -r '.message.bucketName')

        echo "Port : $ssh_port"
        echo "Bucket : $bucket"
    else
        echo "Erreur de communication avec l'API : $response_body"
        exit 1
    fi
}

echo "Récupération de la configuration..."
retrieve_config

echo "Envoie du ping..."
send_ping >/dev/null 2>&1 &

echo "Ouverture de la connexion SSH..."
ssh -o StrictHostKeyChecking=no -N -R $ssh_port:localhost:80 g1@server.g1.south-squad.io &
echo "Lancement de Docker Compose..."
docker-compose up -d

echo "Fin du script"
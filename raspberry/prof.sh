#!/bin/bash                                                                                                                                                                                                                                     set -euo pipefail                                                                                                                                                                                                                               #envoyer register à l'API                                                                                                                                                                                                                       #if [ -f /usr/local/bin/install_script.sh ]; then                                                                           echo "Lancement de install_script.sh..."                                                                                #bash /usr/local/bin/install_script.sh                                                                              #!/bin/bash                                                                                                                                                                                                                                     mac="00:01:02:03:04:05"                                                                                                 sshkey="ssh-rsa AAAAB3...?..."                                                                                                                                                                                                                                                                                                                                          # Échapper les guillemets dans le JSON pour éviter des erreurs de parsing                                               json_data="{\"mac\": \"$mac\", \"sshkey\": \"$sshkey\"}"                                                                                                                                                                                        api_url="http://localhost:3000/register"                                                                                                                                                                                                        # Fichier temporaire pour capturer le body de la réponse                                                                temp_body=$(mktemp)                                                                                                                                                                                                                             # Exécuter curl et capturer le code de retour et le body                                                                http_code=$(curl -s -o "$temp_body" -w "%{http_code}" -X POST "$api_url" -H "Content-Type: application/json" -d "$json_data")

# Lire le contenu du body
response_body=$(cat "$temp_body")

# Supprimer le fichier temporaire
rm -f "$temp_body"

# Afficher les résultats
echo "HTTP Code: $http_code"
echo "Response Body: $response_body"


    # Vérifier si curl a retourné une erreur
    if [ $http_code -eq 200 ]; then
        echo "Requête envoyée avec succès !"
    else
        echo "Erreur de communication avec l'API : $response_body"
        exit 1
    fi

    # Affichage de la réponse
    echo "Réponse de l'API : $response_body"

    # récupérer dans le retour de l'api le port pour connexion SSH, le nom et l'adresse du bucket pour influx db ecrire la configuration pour la récupérer
    # envoyer une requete ping régulièrement
    # ouvrir la connexion r ssh
    # démarrer le docker compose up

#else
#    echo "Erreur : /usr/local/bin/install_script.sh introuvable."
#    exit 1
#fi
<<<<<<< HEAD
FROM alpine:latest

RUN apk add --no-cache curl bash python3 py3-pip openrc jq

COPY install_script.sh /usr/local/bin/install_script.sh

RUN chmod +x /usr/local/bin/install_script.sh


=======
# Utiliser une image Node.js 20 Alpine
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /mosquitto

# Copier les fichiers package.json et installer les dépendances
COPY /mosquitto/package*.json ./
RUN npm install

# Copier les scripts dans le conteneur
COPY ./mosquitto .

# Exposer le port MQTT (si nécessaire pour Mosquitto intégré)
EXPOSE 1884

# Démarrer les deux scripts simultanément
CMD ["sh", "-c", "node publisher.js & node subscriber.js"]
>>>>>>> origin/dev

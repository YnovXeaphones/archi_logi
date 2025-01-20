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

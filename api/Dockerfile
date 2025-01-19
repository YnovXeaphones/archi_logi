FROM node:latest

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +X run.sh

RUN apt-get update && apt-get install -y openssh-server

CMD ["node", "server.js"]
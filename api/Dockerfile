FROM node:bullseye-slim

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

RUN useradd api

COPY . .

USER api:api

CMD [ "node", "server.js" ]
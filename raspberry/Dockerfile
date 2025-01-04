FROM alpine:latest

RUN apk add --no-cache curl bash python3 py3-pip openrc jq

COPY install_script.sh /usr/local/bin/install_script.sh

RUN chmod +x /usr/local/bin/install_script.sh



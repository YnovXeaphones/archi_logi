FROM alpine:latest

RUN apk add --no-cache curl bash python3 py3-pip openrc jq

COPY lancementRaspberry.sh /usr/local/bin/lancementRaspberry.sh
COPY install_script.sh /usr/local/bin/install_script.sh

RUN chmod +x /usr/local/bin/lancementRaspberry.sh \
    && chmod +x /usr/local/bin/install_script.sh

ENTRYPOINT ["/usr/local/bin/lancementRaspberry.sh"]
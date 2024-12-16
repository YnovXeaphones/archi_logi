FROM alpine:latest

RUN apk add --no-cache curl bash

COPY lancementRapsberry.sh /usr/local/bin/lancementRapsberry.sh

RUN chmod +x /usr/local/bin/lancementRapsberry.sh

ENTRYPOINT ["/usr/local/bin/lancementRapsberry.sh"]
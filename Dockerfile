FROM abiosoft/caddy:php-no-stats

LABEL summary="ProFTPd Accountmanager" \
      version="1.0" \
      name="pftpmgr" \
      maintainer="Florian Wolpert <florian@roedling.de>"

RUN apk update && \
    apk add --no-cache php7-ldap mariadb-client bash && \
    rm -rf /var/cache/apk/* /var/tmp/* /tmp/*

COPY ui /ui

RUN chmod +x /ui/src/scripts/*.php
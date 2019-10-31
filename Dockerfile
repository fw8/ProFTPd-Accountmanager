#
# PHP Dependencies
#
FROM composer as vendor

COPY ui/composer.json composer.json
COPY ui/composer.lock composer.lock

RUN composer install \
    --ignore-platform-reqs \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist

#
# Application
#
FROM abiosoft/caddy:php-no-stats

LABEL summary="ProFTPd Accountmanager" \
      version="1.0" \
      name="pftpmgr" \
      maintainer="Florian Wolpert <florian@roedling.de>"

RUN apk update && \
    apk add --no-cache php7-ldap mariadb-client bash && \
    rm -rf /var/cache/apk/* /var/tmp/* /tmp/*

COPY --from=vendor /app/vendor/ /ui/vendor/

COPY crontab /etc/crontabs/root

COPY ui /ui

# Do not use debug code in production
RUN sed -i 's/-debug//g' /ui/public/index.html

RUN chmod +x /ui/src/scripts/*.php
#!/bin/sh

# Generate hostkeys for sftp if /etc/ssh is empty
if [ -z "$(ls -A -- "/etc/ssh")" ]; then
  apk update
  apk upgrade
  apk add openssh-keygen
  ssh-keygen -f /etc/ssh/ssh_host_rsa_key -N '' -t rsa -b 2048 -m PEM
  ssh-keygen -f /etc/ssh/ssh_host_dsa_key -N '' -t dsa -b 1024 -m PEM
  ssh-keygen -f /etc/ssh/ssh_host_ecdsa_key -N '' -t ecdsa -b 521 -m PEM
fi

#localedef -i de_DE -c -f UTF-8 -A /usr/share/locale/locale.alias de_DE.UTF-8
exec "$@"
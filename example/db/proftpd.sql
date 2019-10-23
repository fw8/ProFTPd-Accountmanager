use proftpd;

CREATE TABLE users (
  id VARCHAR(32) NOT NULL DEFAULT '' UNIQUE,
  passwd VARCHAR(32) NOT NULL DEFAULT '',
  uid SMALLINT(6) NOT NULL DEFAULT '1000',
  gid SMALLINT(6) NOT NULL DEFAULT '1000',
  homedir VARCHAR(255) NOT NULL DEFAULT '',
  shell VARCHAR(16) NOT NULL DEFAULT '/bin/false',
  count INT(11) NOT NULL DEFAULT '0',
  last_accessed datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  du BIGINT(20) NOT NULL DEFAULT '0',
  df BIGINT(20) NOT NULL DEFAULT '0',
  enabled BOOLEAN NOT NULL DEFAULT true,
  deleted BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (id)
);
CREATE INDEX users_id_idx ON users (id);

CREATE TABLE groups (
  groupname VARCHAR(32) NOT NULL DEFAULT '',
  gid SMALLINT(6) NOT NULL DEFAULT '1000',
  members VARCHAR(255) NOT NULL DEFAULT ''
);
CREATE INDEX groups_gid_idx ON groups (gid);
INSERT INTO groups (groupname, gid, members) VALUES ('nogroup', 1000, '');


CREATE TABLE login_history (
  id VARCHAR(32) NOT NULL,
  client_ip VARCHAR(45) NOT NULL,
  server_ip VARCHAR(45) NOT NULL,
  protocol VARCHAR(10) NOT NULL,
  access_date DATETIME
);

CREATE TABLE transfer_history (
  id VARCHAR(32) NOT NULL,
  client_ip VARCHAR(45) NOT NULL,
  protocol VARCHAR(10) NOT NULL,
  command VARCHAR(10) NOT NULL,
  filename VARCHAR(200) NOT NULL,
  bytes BIGINT(20) NOT NULL,
  transfer_date DATETIME
);

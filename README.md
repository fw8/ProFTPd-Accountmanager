# ProFTPd-Accountmanager

Simple Web-GUI to manage accounts for a ProFTPd-Server. There are two types of accounts:

1) Normal accounts

    These accounts have their home directory in the given data volume (environment variable ```FTP_DATA_DIR```). No normal account has access to the data of other normal accounts.

2) Subaccounts

    Each account of this type have a relationship to a normal account. They 'live' inside normal accounts which means that their home directory ist a subdirectory of the parents home directory. The parent account can access all the data of his child accounts.

It is possible to create or delete accounts and to change the password. The account name is also the login name and the name of the home directory. When an account is deleted, then all of its data is also removed.
The removal of the data takes place in a background job (the garbage collector) which is startet by cron.

**ATTENTION**
This is "work in progress"... It may not work as expected at the moment


Run example:

    $ cd example
    $ docker-compose up -d

Open Browser on http://localhost

Create a new account

Login to the new account with a sftp-client on <sftp://localhost:2222>

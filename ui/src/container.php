<?php

use DI\Container;
use Slim\Factory\AppFactory;

$container = new Container();
AppFactory::setContainer($container);

$container->set('settings', function ($c) {
    return [
        'proftpd_db' => [
            'host' => getenv('MYSQL_HOST'),
            'user' => getenv('MYSQL_USER'),
            'pass' => getenv('MYSQL_PASSWORD'),
            'dbname' => getenv('MYSQL_DATABASE'),
            'charset' => 'utf8mb4',
        ],
    ];
});

$container->set('proftpd_db', function ($c) {
    $db = $c->get('settings')['proftpd_db'];
    $pdo = new PDO('mysql:host=' . $db['host'] . ';dbname=' . $db['dbname'] . ';charset=' . $db['charset'],
        $db['user'], $db['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
});

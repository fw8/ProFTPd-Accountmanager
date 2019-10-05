<?php

use Slim\Factory\AppFactory;

date_default_timezone_set("MET");
// error_reporting(E_ALL);
// ini_set("display_errors", 1);

require __DIR__ . "/../vendor/autoload.php";

require __DIR__ . "/../src/startup.php";

$app->run();
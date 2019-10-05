<?php

use Slim\Factory\AppFactory;

require 'container.php';

$app = AppFactory::create();

require 'routes.php';

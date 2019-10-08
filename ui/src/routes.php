<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

use App\Controllers\AccountController;

$app->get('/accounts', AccountController::class . ':getall');

$app->get('/accounts/{id}', AccountController::class . ':getone');

$app->post('/accounts', AccountController::class . ':create');

$app->put('/accounts/{id}', AccountController::class . ':update');

$app->delete('/accounts/{id}', AccountController::class . ':delete');
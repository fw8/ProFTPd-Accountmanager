<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

use App\Controllers\AccountController;

$app->get('/accounts', AccountController::class . ':getall');

$app->get('/accounts/{id}', AccountController::class . ':getone');

$app->get('/accounts/{id}/history/transfer', AccountController::class . ':transfer_history');

$app->post('/accounts', AccountController::class . ':create');

$app->post('/accounts/{id}', AccountController::class . ':passwd');

$app->put('/accounts/{id}', AccountController::class . ':update');

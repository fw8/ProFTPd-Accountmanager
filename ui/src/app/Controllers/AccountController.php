<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface as Container;

class AccountController
{
  protected $db;

  public function __construct(Container $c)
  {
    $this->db = $c->get('proftpd_db');
  }

  public function getall(Request $request, Response $response)
  {
    $users = $this->db->query("SELECT * FROM users")->fetchAll();
    $response->getBody()->write(json_encode(['success' => true, 'data' => $users]));
    return $response->withHeader('Content-Type', 'application/json');
  }

  public function create(Request $request, Response $response)
  {
    $data = $request->getParsedBody();
    $userid = filter_var($data['userid'], FILTER_SANITIZE_STRING);
    $passwd = filter_var($data['passwd'], FILTER_SANITIZE_STRING);

    $res = $this->db->prepare("INSERT INTO users (userid, passwd, homedir) VALUES (:userid,ENCRYPT(:passwd),:homedir)")->execute(['userid' => $userid,'passwd' => $passwd,'homedir' => '/data/'.$userid]);

    if ($res) {
      $id = $this->db->lastInsertId();
      $response->getBody()->write(json_encode([ 'success' => true, 'data' => ['id' => $id]]));
    } else {
      $response->getBody()->write(json_encode([ 'success' => false, 'message' => "irgendwas ist schief gelaufen..."]));
    }
    return $response->withHeader('Content-Type', 'application/json');
  }

  public function delete(Request $request, Response $response, array $args)
  {
    $id = filter_var($args['id'], FILTER_SANITIZE_NUMBER_INT);
    $res = $this->db->prepare("DELETE FROM users WHERE id=:id")->execute(['id' => $id]);
    if ($res) {
      $id = $this->db->lastInsertId();
      $response->getBody()->write(json_encode([ 'success' => true ]));
    } else {
      $response->getBody()->write(json_encode([ 'success' => false, 'message' => "irgendwas ist schief gelaufen..."]));
    }
    return $response->withHeader('Content-Type', 'application/json');
  }

}
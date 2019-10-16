<?php

namespace App\Controllers;

use Psr\Container\ContainerInterface as Container;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AccountController
{
    protected $db, $ftp_data_dir;

    public function __construct(Container $c)
    {
        $this->db = $c->get('proftpd_db');
        $this->ftp_data_dir = $c->get('settings')['ftp_data_dir'];
    }

    public function getall(Request $request, Response $response)
    {
        $users = $this->db->query("SELECT * FROM users WHERE deleted = FALSE")->fetchAll();
        $response->getBody()->write(json_encode(['success' => true, 'data' => $users]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getone(Request $request, Response $response, array $args)
    {
        $id = filter_var($args['id'], FILTER_SANITIZE_NUMBER_INT);
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id=:id");
        $stmt->execute(['id' => $id]);
        $res = $stmt->fetchAll();
        $response->getBody()->write(json_encode(['success' => true, 'data' => $res]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function create(Request $request, Response $response)
    {
        $data = $request->getParsedBody();
        $userid = filter_var($data['userid'], FILTER_SANITIZE_STRING);
        $passwd = filter_var($data['passwd'], FILTER_SANITIZE_STRING);

        $res = $this->db->prepare("INSERT INTO users (userid, passwd) VALUES (:userid,ENCRYPT(:passwd))")->execute(['userid' => $userid, 'passwd' => $passwd]);

        if ($res) {
            $id = $this->db->lastInsertId();

            $res = $this->db->prepare("UPDATE users SET homedir=:homedir WHERE id=:id")->execute(['homedir' => $this->ftp_data_dir . '/' . $userid . '.' . $id, 'id' => $id]);

            if ($res) {
                $response->getBody()->write(json_encode(['success' => true, 'data' => ['id' => $id]]));
            } else {
                $response->getBody()->write(json_encode(['success' => false, 'message' => "irgendwas ist schief gelaufen..."]));
            }
        } else {
            $response->getBody()->write(json_encode(['success' => false, 'message' => "irgendwas ist schief gelaufen..."]));
        }
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function update(Request $request, Response $response, array $args)
    {
        $id = filter_var($args['id'], FILTER_SANITIZE_NUMBER_INT);
        //$data = $request->getParsedBody();
        // expect Content-Type: application/json
        // for some reason getParsedBody() fails to decode json
        // maybe some middleware required?
        $data = json_decode($request->getBody()->getContents(), true);
        $enabled = filter_var($data['enabled'], FILTER_VALIDATE_BOOLEAN);
        $enabled = ($enabled) ? 1 : 0;
        $res = $this->db->prepare("UPDATE users SET enabled=:enabled WHERE id=:id")->execute(['enabled' => $enabled, 'id' => $id]);

        if ($res) {
            $response->getBody()->write(json_encode(['success' => true, 'data' => $data]));
        } else {
            $response->getBody()->write(json_encode(['success' => false, 'message' => "irgendwas ist schief gelaufen..."]));
        }
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function delete(Request $request, Response $response, array $args)
    {
        $id = filter_var($args['id'], FILTER_SANITIZE_NUMBER_INT);

        $res = $this->db->prepare("UPDATE users SET deleted = TRUE WHERE id=:id")->execute(['id' => $id]);

        if ($res) {
            $response->getBody()->write(json_encode(['success' => true]));
        } else {
            $response->getBody()->write(json_encode(['success' => false, 'message' => "irgendwas ist schief gelaufen..."]));
        }
        return $response->withHeader('Content-Type', 'application/json');
    }

}

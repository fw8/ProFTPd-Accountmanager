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
        $users = $this->db->query("SELECT id,enabled,count,last_accessed,du,df,deleted FROM users")->fetchAll();
        $response->getBody()->write(json_encode(['success' => true, 'data' => $users]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getone(Request $request, Response $response, array $args)
    {
        $id = filter_var($args['id'], FILTER_SANITIZE_STRING);
        $stmt = $this->db->prepare("SELECT id,enabled,count,last_accessed,du,df,deleted FROM users WHERE id=:id");
        $stmt->execute(['id' => $id]);
        $res = $stmt->fetchAll();
        $response->getBody()->write(json_encode(['success' => true, 'data' => $res]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    // GET /accounts/{id}/history/transfer
    // ?start=0&limit=10&sort=[{"property":"transfer_date","direction":"ASC"}]
    public function transfer_history(Request $request, Response $response, array $args)
    {
        $id = filter_var($args['id'], FILTER_SANITIZE_STRING);
        $params = $request->getQueryParams();
        $start = (int)filter_var($params['start'], FILTER_SANITIZE_NUMBER_INT,['options' => ['default' => 0]]);
        $limit = (int)filter_var($params['limit'], FILTER_SANITIZE_NUMBER_INT,['options' => ['default' => 0]]);
        if (array_key_exists('sort', $params)) { // TODO: add more sanity checks
            $sort = json_decode($params['sort'], true);
            $sort_property = $sort[0]['property'];
            $sort_direction = $sort[0]['direction'];
        } else {
            $sort_property = 'transfer_date';
            $sort_direction = 'DESC';
        }

        $stmt = $this->db->prepare("SELECT COUNT(*) AS total FROM transfer_history WHERE id=:id");
        $stmt->execute(['id' => $id]);
        $res = $stmt->fetch();
        $total = $res['total'];

        $stmt = $this->db->prepare("SELECT * FROM transfer_history WHERE id=:id ORDER BY $sort_property $sort_direction LIMIT $limit OFFSET $start");
        $stmt->execute([ 'id' => $id ]);
        $res = $stmt->fetchAll();

        $response->getBody()->write(json_encode(['success' => true, 'data' => $res, 'total' => $total]));
        return $response->withHeader('Content-Type', 'application/json');
    }


    public function create(Request $request, Response $response)
    {
        $data = $request->getParsedBody();
        $id = filter_var($data['id'], FILTER_SANITIZE_STRING);
        $passwd = filter_var($data['passwd'], FILTER_SANITIZE_STRING);

        $homedir = $this->ftp_data_dir . '/' . $id;

        $res = $this->db->prepare("INSERT INTO users (id, passwd, homedir) VALUES (:id,ENCRYPT(:passwd),:homedir)")->execute(['id' => $id, 'passwd' => $passwd, 'homedir' => $homedir]);

        if ($res) {
            //$id = $this->db->lastInsertId();
            $response->getBody()->write(json_encode(['success' => true, 'data' => ['id' => $id]]));
        } else {
            $response->getBody()->write(json_encode(['success' => false, 'message' => "irgendwas ist schief gelaufen..."]));
        }

        return $response->withHeader('Content-Type', 'application/json');
    }

    public function update(Request $request, Response $response, array $args)
    {
        $id = filter_var($args['id'], FILTER_SANITIZE_STRING);
        //$data = $request->getParsedBody();
        // expect Content-Type: application/json
        // for some reason getParsedBody() fails to decode json
        // maybe some middleware required?
        $data = json_decode($request->getBody()->getContents(), true);
        $enabled = filter_var($data['enabled'], FILTER_VALIDATE_BOOLEAN);
        $deleted = filter_var($data['deleted'], FILTER_VALIDATE_BOOLEAN);
        $enabled = ($enabled) ? 1 : 0;
        $deleted = ($deleted) ? 1 : 0;
        $res = $this->db->prepare("UPDATE users SET enabled=:enabled, deleted=:deleted WHERE id=:id")->execute(['enabled' => $enabled, 'deleted' => $deleted, 'id' => $id]);

        if ($res) {
            $response->getBody()->write(json_encode(['success' => true, 'data' => $data]));
        } else {
            $response->getBody()->write(json_encode(['success' => false, 'message' => "irgendwas ist schief gelaufen..."]));
        }
        return $response->withHeader('Content-Type', 'application/json');
    }

}

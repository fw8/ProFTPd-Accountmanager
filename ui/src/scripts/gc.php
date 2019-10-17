<?php

require __DIR__ . "/../../vendor/autoload.php";

$dbhost = getenv('MYSQL_HOST');
$dbuser = getenv('MYSQL_USER');
$dbpass = getenv('MYSQL_PASSWORD');
$dbname = getenv('MYSQL_DATABASE');

$ftp_data_dir = getenv('FTP_DATA_DIR');

$pdo = new PDO('mysql:host=' . $dbhost . ';dbname=' . $dbname . ';charset=utf8mb4',$dbuser, $dbpass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

$res = $pdo->query("SELECT * FROM users WHERE deleted = TRUE")->fetchAll();

foreach($res as $row) {
  $id = $row['id'];
  $userid = $row['userid'];
  $homedir = $row['homedir'];
  echo "deleting account ".$userid." with homedir ".$homedir."\n";
  if (file_exists($homedir)) {
    echo "deleting directory ".$homedir." recursively\n";
    system('rm -fr '.$homedir);
  }
  $res = $pdo->prepare("DELETE FROM users WHERE id=:id")->execute(['id' => $id]);
}


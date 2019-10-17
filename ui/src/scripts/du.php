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

$res = $pdo->query("SELECT * FROM users")->fetchAll();

foreach($res as $row) {
  $id = $row['id'];
  $homedir = $row['homedir'];
  if (file_exists($homedir)) {
    echo "calculating disk usage of ".$homedir."\n";
    $io = popen ( '/usr/bin/du -sk ' . $homedir, 'r' );
    $size = fgets ( $io, 4096);
    $size = (int) substr ( $size, 0, strpos ( $size, "\t" ) );
    pclose ( $io );
    $bytes = intval($size)*1024; // Size in bytes
    echo "size of ".$homedir." is ".$bytes." bytes\n";
    $res = $pdo->prepare("UPDATE users SET du=:du WHERE id=:id")->execute(['du' => $bytes, 'id' => $id]);
  }
}


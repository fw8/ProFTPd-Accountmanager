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
    $du = fgets ( $io, 4096);
    $du = (int) substr ( $du, 0, strpos ( $du, "\t" ) );
    pclose ( $io );
    $du = intval($du)*1024; // Size in bytes
    echo "size of ".$homedir." is ".$du." bytes\n";

    $io = popen ( '/bin/df -B 1 /data/', 'r' );
    $df = fgets ( $io, 4096); // eat first line with heading
    $df = fgets ( $io, 4096);
    $df = explode(" ",preg_replace('/\s+/', ' ', $df))[1];
    pclose ( $io );
    $df = intval($df);
    $res = $pdo->prepare("UPDATE users SET du=:du, df=:df WHERE id=:id")->execute(['du' => $du, 'df' => $df, 'id' => $id]);
  }
}


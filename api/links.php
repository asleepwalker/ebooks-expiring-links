<?php

include_once '../database.php';

$database = new Database();
$database->connect();

/*if (!<no auth token>) {
	// TODO: Check auth
	http_response_code(403);
	exit;
}*/

$id = $database->escape($_GET['id']);
$bunch = $database->escape($_GET['bunch']);
$links = $database->query('SELECT `code`, `downloads` FROM `links` WHERE `book` = '.$id.' AND `bunch` = '.$bunch);

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="cardbook_'.addslashes($_GET['bunch']).'.csv"');

$fp = fopen('php://output', 'wb');
fputcsv($fp, array('#QR'));
foreach ($links as $link) {
    fputcsv($fp, array('https://localhost/?code='.$link['code']));
}
fclose($fp);

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
$links = $database->query('SELECT `code`, `downloads` FROM `links` WHERE `book` = '.$id);

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="cardbook_links_'.$id.'.csv"');

$fp = fopen('php://output', 'wb');
fputcsv($fp, array('#', 'Code', 'Used'), ',');
foreach ($links as $index => $link) {
	$block = array($index + 1, $link['code'], $link['downloads']);
    fputcsv($fp, $block, ',');
}
fclose($fp);

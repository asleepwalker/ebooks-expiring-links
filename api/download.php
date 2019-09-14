<?php

include_once '../database.php';
include_once './utils.php';

$database = new Database();
$database->connect();

$code = $database->escape($_GET['code']);
$link = $database->query('SELECT * FROM `links` WHERE `code` = '.$code, 'fetch_one');
$book = $database->query('SELECT * FROM `books` WHERE `id` = '.$link['book'], 'fetch_one');

if ($link['downloads'] >= $link['limits']) exit_with_error_code(403);

header("Content-Description: File Transfer"); 
header("Content-Type: application/octet-stream");
header('Content-Disposition: attachment; filename="'.$book['file'].'"');
readfile('../uploads/'.$book['file']);

$database->query('UPDATE `links` SET `downloads` = '.($link['downloads'] + 1).' WHERE `id` = '.$link['id']);
exit;

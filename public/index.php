<?php

include_once './api/database.php';

$database = new Database();
$database->connect();

if (!isset($_GET['code'])) {
	http_response_code(400);
	exit;
}

$code = $database->escape($_GET['code']);
$link = $database->query('SELECT * FROM `links` WHERE `code` = '.$code, 'fetch_one');
if (!$link) { http_response_code(404); exit; }
$book = $database->query('SELECT * FROM `books` WHERE `id` = '.$link['book'], 'fetch_one');
if (!$book) { http_response_code(500); exit; }

$title = $book['title'];
$author = $book['author'];
$fileinfo = pathinfo($book['file']);
$extension = $fileinfo['extension'];
$size = ceil(filesize('uploads/'.$book['file']) / 100000) / 10;
$limit = 5 - $link['downloads'];

include_once './page.php';

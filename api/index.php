<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, HEAD, OPTIONS, POST');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json; charset=UTF-8');

include_once '../database.php';

$database = new Database();
$database->connect();

if (!isset($_GET['method'])) {
	// TODO: Check auth
	http_response_code(403);
	exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	http_response_code(200);
	exit;
}

if ($_GET['method'] === 'auth') {
	$data = json_decode(file_get_contents('php://input'));
	if (!isset($data->login) || !isset($data->password)) { http_response_code(400); exit; }
	$username = $database->escape($data->login);
	$passhash = $database->escape(md5($data->password));
	$user = $database->query('SELECT * FROM `users` WHERE `username` = '.$username.' and `password` = '.$passhash, 'fetch_one');
	echo json_encode(array('result' => $user ? 'ok' : 'invalid'));
	exit;
}

if ($_GET['method'] === 'list') {
	if (!isset($_GET['sort'])) { http_response_code(400); exit; }
	$sort = addslashes($_GET['sort']);
	if (in_array($_GET['sort'], array('title', 'author', 'publisher'))) $sort .= ' COLLATE utf8_unicode_ci';
	$list = $database->query('
		SELECT books.*, links.total as links
		FROM (SELECT id, title, author, publisher, created FROM books) books
		LEFT OUTER JOIN (SELECT COUNT(Id) as total, book FROM links GROUP BY book) links
		ON books.id = links.book
		ORDER BY '.$sort.'
	');
	echo json_encode($list);
	exit;
}

if ($_GET['method'] === 'details') {
	$book_id = $database->escape($_GET['id']);
	$data = $database->query('SELECT * FROM `books` WHERE `id` = '.$book_id, 'fetch_one');
	$links = $database->query('SELECT `bunch` FROM `links` WHERE `book` = '.$book_id.' GROUP BY `bunch`');
	$data['links'] = array_column($links, 'bunch');
	if ($data['file']) {
		$data['fileName'] = $data['file'];
		unset($data['file']);
	}
	echo json_encode($data);
	exit;
}

if ($_GET['method'] === 'create') {
	$title = $database->escape($_POST['title']);
	$author = $database->escape($_POST['author']);
	$publisher = $database->escape($_POST['publisher']);
	$links = (int)$_POST['links'];
	$id = $database->query('INSERT INTO `books` (`title`, `author`, `publisher`, `created`, `file`, `user`) VALUES ('.$title.', '.$author.', '.$publisher.', NOW(), "", 1)', 'insert_id');
	save_file($id, $database);
	$links = generate_links($id, $links, $database);
	echo json_encode(array('result' => 'ok', 'id' => $id, 'links' => $links));
	exit;
}

if ($_GET['method'] === 'edit') {
	$id = (int)$_POST['id'];
	$title = $database->escape($_POST['title']);
	$author = $database->escape($_POST['author']);
	$publisher = $database->escape($_POST['publisher']);
	$database->query('UPDATE `books` SET `title` = '.$title.', `author` = '.$author.', `publisher` = '.$publisher.' WHERE `id` = '.$id);
	if (isset($_FILES['file'])) save_file($id, $database);
	echo json_encode(array('result' => 'ok'));
	exit;
}

if ($_GET['method'] === 'make_links') {
	$id = $database->escape($_GET['id']);
	$links = (int)$_GET['number'];
	$bunch = generate_links($id, $links, $database);
	echo json_encode(array('result' => 'ok', 'bunch' => $bunch));
	exit;
}

function save_file($id, $database) {
	$info = pathinfo($_FILES['file']['name']);
	$destination = $id.'_'.$info['filename'].'.'.$info['extension'];
	move_uploaded_file($_FILES['file']['tmp_name'], '../uploads/'.$destination);
	$file = $database->escape($destination);
	$database->query('UPDATE `books` SET `file` = '.$file.' WHERE `id` = '.$id);
}

function generate_links($book, $total, $database) {
	$bunch = date('d-m-Y_H-i-s').'_'.$total;
	$values = [];
	for ($i = 0; $i < $total; $i++) {
		$values[] = '('.$book.', "'.md5(uniqid(rand(10000, 99999))).'", "'.$bunch.'")';
	}
	$database->query('INSERT INTO `links` (`book`, `code`, `bunch`) VALUES '.implode(',', $values));
	return $bunch;
}

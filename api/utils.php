<?php

function check_auth($database) {
	if (!isset($_GET['token'])) return false;
	$token = $database->escape($_GET['token']);
	$matching_users = $database->query('SELECT `id` FROM `users` WHERE `token` = '.$token, 'count');
	return $matching_users === 1;
}

function exit_with_error_code($code) {
	http_response_code($code);
	exit;
}

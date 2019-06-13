<?php

class Database {
	public $connection = null;
	private $host = 'localhost';
	private $database = 'cardbook';
	private $username = 'root';
	private $password = '';
 
	public function connect() {
		try {
			$this->connection = new PDO('mysql:host='.$this->host.';dbname='.$this->database, $this->username, $this->password);
			$this->connection->exec('set names utf8');
		} catch (PDOException $exception) {
			echo 'Connection error: '.$exception->getMessage();
		}
	}

	public function query($query, $mode = 'fetch_all') {
		$statement = $this->connection->prepare($query);
		$statement->execute();

		switch ($mode) {
			case 'fetch_all': return $this->fetch_all($statement);
			case 'fetch_one': return $this->fetch_one($statement);
			case 'count': return $statement->rowCount();
			case 'insert_id': return $this->connection->lastInsertId();
			default: return false;
		}
	}

	public function escape($string) {
		return $this->connection->quote($string);
	}

	private function fetch_all($statement) {
		$results = array();
		while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
			$results[] = $row;
		}
		return $results;
	}

	private function fetch_one($statement) {
		return $statement->fetch(PDO::FETCH_ASSOC);
	}
}

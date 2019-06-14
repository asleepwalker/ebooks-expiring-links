<!DOCTYPE html>
<html>
	<head>
		<title><?php echo $title; ?></title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="style.css">
		<link rel="stylesheet" type="text/css" href="fonts/fonts.css">
	</head>
	<body>
		<div class="wrapper">
			<header>
				<div class="logo">CARDBOOK</div>
				<buttom class="show-help">?</buttom>
				<buttom class="hide-help">&times;</buttom>
			</header>
			<main>
				<div class="author"><?php echo $author; ?></div>
				<div class="title"><?php echo $title; ?></div>
				<div class="download">
					<a <?php echo $limit > 0 ? 'href="/api/download.php?code='.$_GET['code'].'"' : 'class="disabled"'; ?>>Завантажити</a>
					<div class="info">
						<div class="extension"><?php echo '.'.$extension; ?></div>
						<div class="size"><?php echo $size; ?> MB</div>
					</div>
				</div>
				<div class="counter">Залишилось <span class="value"><?php echo $limit; ?></span> завантаження</div>
			</main>
			<footer>
				Якщо ви не знайшли <span class="show-help">відповідь</span> на питання, телефонуйте за номером <span class="number">0 800 700 600 50</span>
			</footer>
			<div class="faq">
				<h2>Часті запитання</h2>
				<h3>Не вдається завантажити книгу</h3>
				<p>В обязательном порядке на этапе заполнения поля «Клиент разрешил обработку персональных данных» Ответственный Сотрудник по оформлению информирует Клиента о согласии размещения и обработки персональных данных, необходимых для принятия решения о предоставлении Банками кредита на приемлемых для Заемщика условиях.</p>
				<p>В обязательном порядке на этапе заполнения поля «Клиент разрешил обработку персональных данных» Ответственный Сотрудник по оформлению информирует</p>
				<h3>Не вдається відкрити книгу</h3>
				<p>Клиента о согласии размещения и обработки персональных данных, необходимых для принятия решения о предоставлении Банками кредита на приемлемых для Заемщика условиях.</p>
			</div>
		</div>
		<script src="script.js"></script>
	</body>
</html>

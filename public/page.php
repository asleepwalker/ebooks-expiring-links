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
				<div class="logo">
					<img src="logo.svg">
				</div>
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
				<div class="counter">Залишилось <span class="value"><?php echo $limit; ?></span> <span class="label"><?php echo plural_form($limit, array('завантаження', 'завантаження', 'завантажень')) ?></span></div>
			</main>
		</div>
		<script src="script.js"></script>
	</body>
</html>

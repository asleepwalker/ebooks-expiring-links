import React from 'react';

function Header() {
  return (
	<header>
		<div class="logo">CARDBOOK</div>
		<div class="menu">
			<a href="#">Каталог книг</a>
			<a class="create-btn" href="#">Додати книгу</a>
			<a class="logout" href="#"><span>Вийти</span></a>
		</div>
	</header>
  );
}

export default Header;
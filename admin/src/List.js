import React from 'react';

function List() {
  return (
	<main class="list">
		<div class="header">
			<div class="cell date active"><span>Дата</span></div>
			<div class="cell author"><span>Автор</span></div>
			<div class="cell title"><span>Назва</span></div>
			<div class="cell publisher"><span>Видавництво</span></div>
			<div class="cell total"><span>Кількість</span></div>
		</div>
		<div class="body">
			<div class="item">
				<div class="cell date">03.06.2019 15:43</div>
				<div class="cell author">Іван Нечуй-Левицький</div>
				<div class="cell title">Побіда Хмельницького під Збаражем і Зборовом</div>
				<div class="cell publisher">Основи</div>
				<div class="cell total">10 000</div>
			</div>
		</div>
	</main>
  );
}

export default List;
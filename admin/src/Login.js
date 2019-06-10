import React from 'react';

function Login(props) {
  return (
	<main className="login">
		<form action="#" method="post">
			<h1>Вхід</h1>
			<div className="fields">
				<input className="login" name="login" placeholder="логін" />
				<input className="password" type="password" name="password" placeholder="пароль" />
			</div>
			<button type="submit" className="submit" onClick={props.onSubmit}>Увійти</button>
		</form>
	</main>
  );
}

export default Login;

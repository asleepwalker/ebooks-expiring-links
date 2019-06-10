import React, { Component } from 'react';
import axios from 'axios';

export default class Login extends Component {
	state = {
		login: '',
		password: ''
	};

	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	handleSubmit = event => {
		event.preventDefault();

		axios.post('/api/?method=auth', this.state)
			.then(response => {
				if (response.data.result === 'ok') {
					this.props.onSubmit();
				} else {
					alert('Невірний логін або пароль');
				}
			})
			.catch(error => alert('При авторизації сталася помилка'));
	};

	render() {
		const { login, password } = this.state;

		return (
			<main className="login">
				<form>
					<h1>Вхід</h1>
					<div className="fields">
						<input
							className="login"
							name="login"
							placeholder="логін"
							value={login}
							onChange={this.handleChange}
						/>
						<input
							className="password"
							type="password"
							name="password"
							placeholder="пароль"
							value={password}
							onChange={this.handleChange}
						/>
					</div>
					<button
						className="submit"
						disabled={!login || !password}
						onClick={this.handleSubmit}
					>Увійти</button>
				</form>
			</main>
		  );
	}
}

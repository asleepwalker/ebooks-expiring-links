import React, { Component } from 'react';
import axios from 'axios';
import cx from 'classnames';

import { apiRoot } from './config';

export default class Login extends Component {
	state = {
		login: '',
		password: '',
		error: false
	};

	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
			error: false
		});
	};

	handleSubmit = event => {
		event.preventDefault();
		this.setState({ error: false });

		axios.post(`${apiRoot}?method=auth`, this.state)
			.then(response => {
				if (response.data.result === 'ok') {
					this.props.onSubmit();
				} else {
					this.setState({ error: 'invalid' });
				}
			})
			.catch(error => {
				this.setState({ error: 'failed' });
			});
	};

	renderError(code) {
		switch (code) {
			case 'invalid': return <div className="error-msg">Логін або пароль було введено неправильно</div>;
			case 'failed': return <div className="error-msg">При авторизації сталася помилка, спробуйте ще раз</div>;
			default: return null;
		}
	}

	render() {
		const { login, password, error } = this.state;
		const fieldsClassName = cx('fields', { error: error === 'invalid' });

		return (
			<main className="login">
				<div className="form">
					<h1>Вхід</h1>
					<div className={fieldsClassName}>
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
					<div className="controls">
						{error && this.renderError(error)}
						<button
							className="button"
							disabled={!login || !password}
							onClick={this.handleSubmit}
						>Увійти</button>
					</div>
				</div>
			</main>
		  );
	}
}

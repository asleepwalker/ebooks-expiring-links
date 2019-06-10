import React, { Component } from 'react';

import Header from './Header';
import Login from './Login';
import List from './List';
import Editor from './Editor';

export default class App extends Component {
	state = {
		authorized: false,
		editing: false
	};

	handleLogin = event => {
		event.preventDefault();
		this.setState({ authorized: true });
	};

	handleShowList = () => {
		this.setState({ editing: false });
	};

	handleShowCreate = () => {
		this.setState({ editing: 0 });
	};

	handleShowEditor = id => {
		this.setState({ editing: id });
	};

	handleLogout = () => {
		this.setState({ authorized: false });
	};

	renderPanel() {
		const { authorized, editing } = this.state;

		if (authorized === false) {
			return <Login onSubmit={this.handleLogin} />;
		}

		if (editing === false) {
			return <List onShowEditor={this.handleShowEditor} />;
		}

		return <Editor id={editing} onCreate={this.handleShowEditor} />;
	}

	render() {
		const { authorized, editing } = this.state;

		return (
			<div className="wrapper">
				<Header
					showMenu={authorized}
					listButtonActive={authorized && editing === false}
					createButtonActive={authorized && editing === 0}
					onShowList={this.handleShowList}
					onShowEditor={this.handleShowCreate}
					onLogout={this.handleLogout}
				/>
				{ this.renderPanel() }
			</div>
		);
	}
}

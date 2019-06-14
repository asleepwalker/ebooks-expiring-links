import React, { Component } from 'react';

import Header from './Header';
import Login from './Login';
import List from './List';
import Create from './Create';
import Editor from './Editor';

export default class App extends Component {
	state = {
		authorized: false,
		editing: false
	};

	handleLogin = event => {
		this.setState({
			authorized: true,
			editing: false
		});
	};

	handleShowList = () => {
		this.setState({ editing: false });
	};

	handleCreate = () => {
		this.setState({ editing: 0 });
	};

	handleEdit = id => {
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

		if (editing === 0) {
			return <Create />;
		}

		if (editing > 0) {
			return <Editor id={editing} />;
		}

		return <List onEdit={this.handleEdit} />;
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
					onCreate={this.handleCreate}
					onLogout={this.handleLogout}
				/>
				{ this.renderPanel() }
			</div>
		);
	}
}

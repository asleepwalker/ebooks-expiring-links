import React, { Component } from 'react';

import Header from './Header';
import Login from './Login';
import List from './List';
import Create from './Create';
import Editor from './Editor';
import UnsavedChanges from './UnsavedChanges';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.editorRef = null;
		this.state = {
			authorized: false,
			editing: false,
			unsavedChanges: false,
			authToken: ''
		};
	}

	handleLogin = authToken => {
		this.setState({
			authorized: true,
			editing: false,
			authToken
		});
	};

	handleShowList = () => {
		this.setStateIfNoUnsavedChanges({ editing: false });
	};

	handleCreate = () => {
		this.setStateIfNoUnsavedChanges({ editing: 0 });
	};

	handleEdit = id => {
		this.setStateIfNoUnsavedChanges({ editing: id });
	};

	handleLogout = () => {
		this.setStateIfNoUnsavedChanges({
			authorized: false,
			authToken: ''
		});
	};

	handleEditorRef = instance => {
		this.editorRef = instance;
	};

	getUnsavedChangesFromRef = () => {
		const { editing } = this.state;
		return editing !== false && this.editorRef && this.editorRef.state.changed;
	};

	setStateIfNoUnsavedChanges = stateUpdate => {
		if (this.getUnsavedChangesFromRef()) {
			this.setState({ unsavedChanges: stateUpdate });
		} else {
			this.setState({
				...stateUpdate,
				unsavedChanges: false
			});
		}
	};

	validateForm = () => {
		const { editing } = this.state;
		if (editing === false || !this.editorRef) return false;

		const { invalid } = this.editorRef.validateForm();
		return invalid;
	};

	submitForm = event => {
		event.stopPropagation();
		this.editorRef.handleSubmit(null, this.applyDeferredUpdate);
	};

	applyDeferredUpdate = () => {
		if (this.state.unsavedChanges) {
			this.setState({
				...this.state.unsavedChanges,
				unsavedChanges: false
			});
		}
	};

	resetDeferredUpdate = () => {
		this.setState({ unsavedChanges: false });
	};

	renderPanel() {
		const { authorized, editing } = this.state;

		if (authorized === false) {
			return this.renderLogin();
		} else if (editing === 0) {
			return this.renderCreate();
		} else if (editing > 0) {
			return this.renderEditor();
		} else {
			return this.renderList();
		}
	}

	renderLogin() {
		return <Login onSubmit={this.handleLogin} />;
	}

	renderList() {
		const { authToken } = this.state;

		return (
			<List
				onEdit={this.handleEdit}
				authToken={authToken}
			/>
		);
	}

	renderCreate() {
		const { authToken } = this.state;

		return (
			<Create
				ref={this.handleEditorRef}
				authToken={authToken}
			/>
		);
	}

	renderEditor() {
		const { editing, authToken } = this.state;

		return (
			<Editor id={editing}
				ref={this.handleEditorRef}
				authToken={authToken}
			/>
		);
	}

	renderUnsavedChanges() {
		return (
			<UnsavedChanges
				onSubmit={this.submitForm}
				onReset={this.applyDeferredUpdate}
				onCancel={this.resetDeferredUpdate}
				invalid={this.validateForm()}
			/>
		);
	}

	render() {
		const { authorized, editing, unsavedChanges } = this.state;

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
				{ unsavedChanges && this.renderUnsavedChanges() }
			</div>
		);
	}
}

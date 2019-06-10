import React, { Component } from 'react';
import axios from 'axios';

export default class List extends Component {
	state = {
		sortBy: 'created',
		list: []
	};

	columns = [
		{ name: 'created', title : 'Дата' },
		{ name: 'author', title : 'Автор' },
		{ name: 'title', title : 'Назва' },
		{ name: 'publisher', title : 'Видавництво' },
		{ name: 'links', title : 'Кількість' }
	];

	componentDidMount() {
		this.fetchData();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.sortBy !== this.state.sortBy) {
			this.fetchData();
		}
	}

	fetchData = () => {
		const { sortBy } = this.state;

		axios.get(`/api/?method=list&sort=${sortBy}`)
			.then(response => this.setState({ list: response.data }))
			.catch(error => alert('При завантаженні списку сталася помилка'));
	};

	handleSortBy = column => {
		this.setState({ sortBy: column });
	};

	handleOpenEditor = () => {
		this.props.onShowEditor();
	};

	renderHeaderCell(data) {
		const { sortBy } = this.state;
		const { name, title } = data;

		return (
			<div className={`cell ${name} ${sortBy === name ? ' active' : ''}`} key={name}>
				<span onClick={() => this.handleSortBy(name)}>
					{title}
				</span>
			</div>
		);
	}

	renderItem(data) {
		const { onShowEditor } = this.props;
		const { id, ...bookData } = data;

		return (
			<div
				className="item"
				onClick={() => onShowEditor(id)}
				key={id}
			>
				{this.columns.map(({ name: column }) =>
					<div className={`cell ${column}`} key={column}>
						{bookData[column]}
					</div>
				)}
			</div>
		);
	}

	render() {
		const { list } = this.state;

		return (
			<main className="list">
				<div className="header">
					{this.columns.map((data) => this.renderHeaderCell(data))}
				</div>
				<div className="body">
					{list.map((data) => this.renderItem(data))}
				</div>
			</main>
		);
	}
}

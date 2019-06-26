import React, { Component } from 'react';
import axios from 'axios';

import { apiRoot } from './config';

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
		const { authToken } = this.props;
		const { sortBy } = this.state;

		axios.get(`${apiRoot}?method=list&sort=${sortBy}&token=${authToken}`)
			.then(response => Array.isArray(response.data) && this.setState({ list: response.data }))
			.catch(error => alert('При завантаженні списку сталася помилка'));
	};

	handleSortBy = column => {
		this.setState({ sortBy: column });
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
		const { onEdit } = this.props;
		const { id, ...bookData } = data;

		return (
			<div
				className="item"
				onClick={() => onEdit(id)}
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
				<h1>Каталог</h1>
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

import React, { Component } from 'react';
import axios from 'axios';
import cx from 'classnames';

import Uploader from './Uploader';
import { apiRoot } from './config';

export default class Editor extends Component {
	state = {
		author: '',
		title: '',
		publisher: '',
		file: false,
		fileName: '',
		editing: {},
		links: [],
		changed: false,
		changesSaved: false,
		showCreateLinks: false,
		newLinks: ''
	};

	componentDidMount() {
		const { id, authToken } = this.props;

		axios.get(`${apiRoot}?method=details&id=${id}&token=${authToken}`)
			.then(response => this.setState({ ...response.data }))
			.catch(error => alert('При завантаженні інформації сталася помилка'));
	}

	handleEdit = name => {
		this.setState({
			editing: {
				...this.state.editing,
				[name]: true
			}
		});
	};

	handleChange = (name, value) => {
		this.setState({
			[name]: value,
			changed: true,
			changesSaved: false
		});
	};

	handleInputChange = event => {
		this.handleChange(event.target.name, event.target.value);
	};

	handleFileChange = file => {
		this.handleEdit('file');
		this.handleChange('file', file);
		this.setState({ fileName: file.name });
	};

	handleCreateNewLinks = () => {
		this.setState({
			showCreateLinks: true,
			newLinks: ''
		});
	};

	handleChangeNewLinks = event => {
		this.setState({ newLinks: event.target.value });
	};

	handleSubmitNewLinks = () => {
		const { id, authToken } = this.props;
		const { newLinks } = this.state;

		axios.get(`${apiRoot}?method=make_links&id=${id}&number=${newLinks}&token=${authToken}`)
			.then(response => {
				if (response.data.result === 'ok') {
					this.setState({
						links: [...this.state.links, response.data.bunch],
						showCreateLinks: false
					});
				} else {
					alert('При генерації посилань сталася помилка');
				}
			})
			.catch(error => alert('При генерації посилань сталася помилка'));		
	};

	handleSubmit = (event, callback) => {
		const { id, authToken } = this.props;
		const { author, title, publisher, file } = this.state;
		const { invalid } = this.validateForm();

		if (invalid) {
			alert('Форма заповнена не повністю');
			return;
		}

		const formData = new FormData();

		formData.append('id', id);
		formData.append('author', author);
		formData.append('title', title);
		formData.append('publisher', publisher);

		if (file) {
			formData.append('file', file);
		}

		axios.post(`${apiRoot}?method=edit&token=${authToken}`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
			.then(response => {
				if (response.data.result === 'ok') {
					this.setState({
						changed: false,
						changesSaved: true
					});
					if (callback) callback();
				}
			})
			.catch(error => {
				alert('При збереженні даних сталася помилка');
			});
	};

	validateForm = () => {
		const { author, title, publisher, file, editing } = this.state;

		const invalid = [
			!editing.author || author !== '',
			!editing.title || title !== '',
			!editing.publisher || publisher !== '',
			!editing.file || file
		].some(valid => !valid);

		return { invalid };
	};

	renderInfoSection() {
		const { author, title, publisher, editing } = this.state;

		return (
			<section className="info">
				<div className={cx('data', 'author', { hidden: editing.author })}>
					<span className="value">{author}</span>
					<button className="edit" onClick={() => this.handleEdit('author')}></button>
				</div>
				<div className={cx('field', 'author', { hidden: !editing.author })}>
					<input
						name="author"
						placeholder="Автор книги"
						value={author}
						onChange={this.handleInputChange}
					/>
				</div>
				<div className={cx('data', 'title', { hidden: editing.title })}>
					<span className="value">{title}</span>
					<button className="edit" onClick={() => this.handleEdit('title')}></button>
				</div>
				<div className={cx('field', 'title', { hidden: !editing.title })}>
					<input
						name="title"
						placeholder="Назва"
						value={title}
						onChange={this.handleInputChange}
					/>
				</div>
				<div className={cx('data', 'publisher', { hidden: editing.publisher })}>
					<span className="value">Видавництво: {publisher}</span>
					<button className="edit" onClick={() => this.handleEdit('publisher')}></button>
				</div>
				<div className={cx('field', 'publisher', { hidden: !editing.publisher })}>
					<input
						name="publisher"
						placeholder="Видавництво"
						value={publisher}
						onChange={this.handleInputChange}
					/>
				</div>
			</section>
		);
	}

	renderUploadSection() {
		const { fileName } = this.state;

		return (
			<section className="upload">
				<h2>Файл книги</h2>
				<div className="description">За необхідності оновити книгу, натисніть кнопку або перетягніть файл потрібного формату у відповідну комірку</div>
				<Uploader fileName={fileName} onChange={this.handleFileChange} />
			</section>
		);
	}

	renderResultSection() {
		const { id, authToken } = this.props;
		const { links, showCreateLinks, newLinks } = this.state;

		return (
			<section className="result">
				<div className="header">
					<h2>Список посилань</h2>
					<button
						className="button create-btn"
						disabled={showCreateLinks}
						onClick={this.handleCreateNewLinks}
					>Створити посилання</button>
				</div>
				<div className="existing-links">
					{links.map(bunch => (
						<a
							className="get-links"
							href={`${apiRoot}links.php?id=${id}&bunch=${bunch}&token=${authToken}`}
							key={bunch}
						>
							Завантажити<br/>
							{`cardbook_${bunch}.csv`}
						</a>
					))}
				</div>
				{showCreateLinks && (
					<div className="new-links">
						<h2>Генерація посилань</h2>
						<div className="description">Введіть необхідну кількість унікальних посилань</div>
						<div className="fields">
							<div className="field">
								<label htmlFor="newLinks">Кількість посилань</label>
								<input
									id="newLinks"
									type="number"
									name="newLinks"
									value={newLinks}
									onChange={this.handleChangeNewLinks}
								/>
							</div>
							<button
								className="submit"
								disabled={!newLinks}
								onClick={this.handleSubmitNewLinks}
							>Згенерувати</button>
						</div>
					</div>
				)}
			</section>
		);
	}

	renderSubmitSection() {
		const { author, title, publisher, file, editing, changed, changesSaved } = this.state;

		const invalid = [
			!editing.author || author !== '',
			!editing.title || title !== '',
			!editing.publisher || publisher !== '',
			!editing.file || file
		].some(valid => !valid);

		return (
			<section className="submit">
				<button
					className={cx('button', { published: changesSaved })}
					disabled={invalid || !changed}
					onClick={this.handleSubmit}
				>
					{!changesSaved ? 'Зберегти зміни' : 'Зміни збережено'}
				</button>
			</section>
		);
	}

	render() {
		return (
			<main className="edit">
				<h1>Редагування книги</h1>
				{ this.renderInfoSection() }
				{ this.renderUploadSection() }
				{ this.renderResultSection() }
				{ this.renderSubmitSection() }
			</main>
		);
	}
}

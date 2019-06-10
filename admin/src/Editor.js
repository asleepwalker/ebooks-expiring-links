import React, { Component } from 'react';
import axios from 'axios';
import cx from 'classnames';

import Uploader from './Uploader';

const defaultState = {
	author: '',
	title: '',
	publisher: '',
	file: false,
	fileInfo: false,
	links: '',
	changed: false
};

export default class Editor extends Component {
	state = defaultState;

	componentDidMount() {
		if (this.props.id) {
			axios.get(`/api/?method=details&id=${this.props.id}`)
				.then(response => this.setState({ ...response.data }))
				.catch(error => alert('При завантаженні інформації сталася помилка'));
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.id !== this.props.id && this.props.id === 0) {
			this.setState(defaultState);
		}
	}

	handleChange = (name, value) => {
		this.setState({
			[name]: value,
			changed: true
		});
	};

	handleInputChange = event => {
		this.handleChange(event.target.name, event.target.value);
	};

	handleFileChange = file => {
		this.handleChange('file', file);
		this.setState({
			fileInfo: {
				name: file.name,
				size: file.size
			}
		});
	};

	handleSubmit = () => {
		const { id, onCreate } = this.props;
		const { author, title, publisher, file, links } = this.state;
		const formData = new FormData();
		let method = 'create';

		formData.append('author', author);
		formData.append('title', title);
		formData.append('publisher', publisher);
		formData.append('links', links);

		if (id) {
			formData.append('id', id);
			method = 'edit';
		}

		if (file) {
			console.log('file', file);
			formData.append('file', file);
		}

		axios.post(`/api/?method=${method}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
        	if (response.data.result === 'ok') {
				this.setState({ changed: false });
				if (!id) onCreate(response.data.id);
			} else {
				alert('При збереженні даних сталася помилка');
			}
        });

		
	};

	renderInfoSection() {
		const { author, title, publisher } = this.state;

		return (
			<section className="info">
				<h2>1. Інформація про книгу</h2>
				<div className="fields">
					<div className="field author">
						<label htmlFor="author">Автор книги</label>
						<input
							id="author"
							name="author"
							placeholder="Ім’я, призвище"
							value={author}
							onChange={this.handleInputChange}
						/>
					</div>
					<div className="field title">
						<label htmlFor="title">Назва</label>
						<input
							id="title"
							name="title"
							value={title}
							onChange={this.handleInputChange}
						/>
					</div>
					<div className="field publisher">
						<label htmlFor="publisher">Видавництво</label>
						<input
							id="publisher"
							name="publisher"
							value={publisher}
							onChange={this.handleInputChange}
						/>
					</div>
				</div>
			</section>
		);
	}

	renderUploadSection() {
		const { fileInfo } = this.state;

		return (
			<section className="upload">
				<h2>2. Завантаження файлів</h2>
				<div className="description">Перетягніть файл потрібного формату у відповідну комірку</div>
			    <Uploader fileName={fileInfo.name} onChange={this.handleFileChange} />
			</section>
		);
	}

	renderLinksSection() {
		const { links } = this.state;

		return (
			<section className="links">
				<h2>3. Генерація посилань</h2>
				<div className="description">Введіть необхідну кількість унікальних посилань</div>
				<div className="fields">
					<div className="field">
						<label htmlFor="links">Кількість посилань</label>
						<input
							id="links"
							type="number"
							name="links"
							value={links}
							onChange={this.handleInputChange}
						/>
					</div>
				</div>
			</section>
		);
	}

	renderSubmitSection() {
		const { id } = this.props;
		const { author, title, publisher, fileInfo, links, changed } = this.state;

		const data = [
			{ valid: author !== '', text: author, placeholder: 'Автор' },
			{ valid: title !== '', text: title, placeholder: 'Назва' },
			{ valid: publisher !== '', text: publisher, placeholder: 'Видавництво' },
			{ valid: fileInfo, text: `${fileInfo.name} ${Math.ceil(fileInfo.size / 100000) / 10} MB`, placeholder: 'Файл' },
			{ valid: links > 0, text: `${links} посилань`, placeholder: 'Кількість посилань' }
		];
		const invalid = data.some(({ valid }) => !valid);

		return (
			<section className="submit">
				<h2>4. Резюме</h2>
				<div className="data">
					{data.map(({ valid, text, placeholder }, index) =>
						<p className={cx({ 'invalid': !valid })} key={index}>
							{valid ? text : placeholder}
						</p>
					)}
				</div>
				<button
					className={cx('button', { published: id && !changed })}
					disabled={invalid || !changed}
					onClick={this.handleSubmit}
				>
					{!id || changed ? 'Опублікувати' : 'Опубліковано'}
				</button>
			</section>
		);
	}

	renderResultSection() {
		const { id } = this.props;

		const notAvailable = <div className="error-msg">Опублікуйте книгу для генерації посилань на неї</div>;
		const link = (
			<a className="get-links" href={`/api/links.php?id=${id}`}>
				{`cardbook_links_${id}.csv`}
			</a>
		);

		return (
			<section className="result">
				<h2>5. Завантажте файл для генерації QR-кодів</h2>
				<div className="description">Завантажте файл на компьютер для подальшої роботи в InDesign</div>
				{ !id ? notAvailable : link }
			</section>
		);
	}

	render() {
		return (
			<main className="edit">
				{ this.renderInfoSection() }
				{ this.renderUploadSection() }
				{ this.renderLinksSection() }
				{ this.renderSubmitSection() }
				{ this.renderResultSection() }
			</main>
		);
	}
}

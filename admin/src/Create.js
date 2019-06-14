import React, { Component } from 'react';
import axios from 'axios';
import cx from 'classnames';

import Uploader from './Uploader';
import { apiRoot } from './config';

export default class Create extends Component {
	state = {
		id: false,
		author: '',
		title: '',
		publisher: '',
		file: false,
		links: '',
		changed: false,
		published: false,
		firstBunch: ''
	};

	handleChange = (name, value) => {
		this.setState({
			[name]: value,
			changed: true
		});
	};

	handleInputChange = event => {
		this.handleChange(event.target.name, event.target.value);
	};

	handleSubmit = () => {
		const { author, title, publisher, file, links } = this.state;
		const formData = new FormData();

		formData.append('author', author);
		formData.append('title', title);
		formData.append('publisher', publisher);
		formData.append('file', file);
		formData.append('links', links);

		axios.post(`${apiRoot}?method=create`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
        	if (response.data.result === 'ok') {
				this.setState({
					id: response.data.id,
					published: true,
					firstBunch: response.data.links
				});
			} else {
				alert('При збереженні даних сталася помилка');
			}
        });

		
	};

	renderInfoSection() {
		const { author, title, publisher, published } = this.state;

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
							disabled={published}
						/>
					</div>
					<div className="field title">
						<label htmlFor="title">Назва</label>
						<input
							id="title"
							name="title"
							value={title}
							onChange={this.handleInputChange}
							disabled={published}
						/>
					</div>
					<div className="field publisher">
						<label htmlFor="publisher">Видавництво</label>
						<input
							id="publisher"
							name="publisher"
							value={publisher}
							onChange={this.handleInputChange}
							disabled={published}
						/>
					</div>
				</div>
			</section>
		);
	}

	renderUploadSection() {
		const { file } = this.state;

		return (
			<section className="upload">
				<h2>2. Завантаження файлів</h2>
				<div className="description">Натисніть кнопку або перетягніть файл потрібного формату у відповідну комірку</div>
			    <Uploader fileName={file.name} onChange={file => this.handleChange('file', file)} />
			</section>
		);
	}

	renderLinksSection() {
		const { links, published } = this.state;

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
							disabled={published}
						/>
					</div>
				</div>
			</section>
		);
	}

	renderSubmitSection() {
		const { author, title, publisher, file, links, changed, published } = this.state;

		const data = [
			{ valid: author !== '', text: author, placeholder: 'Автор' },
			{ valid: title !== '', text: title, placeholder: 'Назва' },
			{ valid: publisher !== '', text: publisher, placeholder: 'Видавництво' },
			{ valid: file, text: `${file.name} ${Math.ceil(file.size / 100000) / 10} MB`, placeholder: 'Файл' },
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
					className={cx('button', { published })}
					disabled={invalid || published || !changed}
					onClick={this.handleSubmit}
				>
					{!published ? 'Опублікувати' : 'Опубліковано'}
				</button>
			</section>
		);
	}

	renderResultSection() {
		const { id, published, firstBunch } = this.state;

		const notAvailable = <div className="error-msg">Опублікуйте книгу для генерації посилань на неї</div>;
		const link = (
			<a className="get-links" href={`${apiRoot}links.php?id=${id}&bunch=${firstBunch}`}>
				Завантажити<br/>
				{`cardbook_${firstBunch}.csv`}
			</a>
		);

		return (
			<section className="result">
				<h2>5. Завантажте файл для генерації QR-кодів</h2>
				<div className="description">Завантажте файл на комп'ютер для подальшої роботи в InDesign</div>
				{published ? link : notAvailable}
			</section>
		);
	}

	render() {
		return (
			<main className="create">
				<h1>Нова книга</h1>
				{ this.renderInfoSection() }
				{ this.renderUploadSection() }
				{ this.renderLinksSection() }
				{ this.renderSubmitSection() }
				{ this.renderResultSection() }
			</main>
		);
	}
}

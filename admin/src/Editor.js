import React, { Component } from 'react';
import cx from 'classnames';

import Uploader from './Uploader';

export default class Editor extends Component {
	state = {
		author: '',
		title: '',
		publisher: '',
		file: false,
		total: '',
		changed: false
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
		const { bookId, onCreate } = this.props;

		this.setState({ changed: false });

		if (!bookId) {
			onCreate(1);
		}
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
		return (
			<section className="upload">
				<h2>2. Завантаження файлів</h2>
				<div className="description">Перетягніть файл потрібного формату у відповідну комірку</div>
			    <Uploader onChange={this.handleChange} />
			</section>
		);
	}

	renderLinksSection() {
		const { total } = this.state;

		return (
			<section className="links">
				<h2>3. Генерація посилань</h2>
				<div className="description">Введіть необхідну кількість унікальних посилань</div>
				<div className="fields">
					<div className="field">
						<label htmlFor="total">Кількість посилань</label>
						<input
							id="total"
							type="number"
							name="total"
							value={total}
							onChange={this.handleInputChange}
						/>
					</div>
				</div>
			</section>
		);
	}

	renderSubmitSection() {
		const { bookId } = this.props;
		const { author, title, publisher, file, total, changed } = this.state;

		const data = [
			{ valid: author !== '', text: author, placeholder: 'Автор' },
			{ valid: title !== '', text: title, placeholder: 'Назва' },
			{ valid: publisher !== '', text: publisher, placeholder: 'Видавництво' },
			{ valid: file, text: `${file.name} ${Math.ceil(file.size / 100000) / 10} MB`, placeholder: 'Файл' },
			{ valid: total > 0, text: `${total} посилань`, placeholder: 'Кількість посилань' }
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
					className={cx('button', { published: bookId && !changed })}
					disabled={invalid || !changed}
					onClick={this.handleSubmit}
				>
					{!bookId || changed ? 'Опублікувати' : 'Опубліковано'}
				</button>
			</section>
		);
	}

	renderResultSection() {
		const { bookId } = this.props;

		const notAvailable = <div className="error-msg">Опублікуйте книгу для генерації посилань на неї</div>;

		return (
			<section className="result">
				<h2>5. Завантажте файл для генерації QR-кодів</h2>
				<div className="description">Завантажте файл на компьютер для подальшої роботи в InDesign</div>
				{ !bookId ? notAvailable : 'done' }
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

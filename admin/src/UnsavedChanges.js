import React from 'react';

const sameTarget = callback => event => {
	if (event.target === event.currentTarget) {
		callback(event);
	}
};

export default function UnsavedChanges({ onSubmit, onReset, onCancel, invalid }) {
	return (
		<div className="unsaved-changes" onClick={sameTarget(onCancel)}>
			<div className="dialog">
				<span className="close" onClick={onCancel}></span>
				<div className="message">У вас є незбережені зміни.<br/>Зберегти їх?</div>
				<div className="controls">
					<button className="submit button" onClick={onSubmit} disabled={invalid}>Зберегти</button>
					<span className="cancel" onClick={onReset}>Закрити без змін</span>
				</div>
			</div>
		</div>
	);
};

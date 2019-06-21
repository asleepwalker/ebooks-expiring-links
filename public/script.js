const body = document.querySelector('body');
const showHelpButtons = document.querySelectorAll('.show-help');
const hideHelpButton = document.querySelector('.hide-help');
const downloadButton = document.querySelector('.download a');
const counterValue = document.querySelector('.counter .value');
const counterTitle = document.querySelector('.counter .label');

showHelpButtons.forEach(button => button.onclick = () => {
	body.className = 'show-faq';
});

hideHelpButton.onclick = () => {
	body.className = '';
};

downloadButton.onclick = () => {
	if (downloadButton.className !== 'disabled') {
		const value = counterValue.innerHTML - 1;
		counterValue.innerHTML = value;
		counterTitle.innerHTML = pluralForm(value, ['завантаження', 'завантаження', 'завантаженнь']);

		if (value === 0) {
			setTimeout(() => {
				downloadButton.className = 'disabled';
				downloadButton.href = '';
			});
		}
	}
};

function pluralForm(n, titles) {
	return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
}

const body = document.querySelector('body');
const showHelpButtons = document.querySelectorAll('.show-help');
const hideHelpButton = document.querySelector('.hide-help');
const downloadButton = document.querySelector('.download a');
const counterValue = document.querySelector('.counter .value');

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

		if (value === 0) {
			setTimeout(() => {
				downloadButton.className = 'disabled';
				downloadButton.href = '';
			});
		}
	}
};

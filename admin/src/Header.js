import React from 'react';
import cx from 'classnames';

export default function Header({
	showMenu = true,
	listButtonActive = false,
	createButtonActive = false,
	onShowList,
	onCreate,
	onLogout
}) {
	const listButtonClassNames = cx('item', { active: listButtonActive });
	const createButtonClassNames = cx('item', 'button create-btn', { disabled: createButtonActive });

	return (
		<header>
			<div className="logo">CARDBOOK</div>
			{ showMenu && (
				<div className="menu">
					<span className={listButtonClassNames} onClick={onShowList}>Каталог книг</span>
					<span className={createButtonClassNames} onClick={onCreate}>Додати книгу</span>
					<span className="item logout" onClick={onLogout}>Вийти</span>
				</div>
			)}
		</header>
	);
};

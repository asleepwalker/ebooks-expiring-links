import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';

export default function Uploader({ fileName, onChange }) {
	const onDrop = useCallback(acceptedFiles => {
		if (acceptedFiles.length) {
			onChange(acceptedFiles[0]);
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
	const className = cx('drop-zone', { active: isDragActive, filled: fileName });
	const rootProps = { ...getRootProps(), className: className };
	const inputProps = { ...getInputProps(), multiple: false };
	const text = isDragActive ? 'Завантажити' : (fileName ? fileName : '.epub');

	return (
		<div {...rootProps}>
		  <input {...inputProps} />
		  <div className="text">{text}</div>
		</div>
	);
};

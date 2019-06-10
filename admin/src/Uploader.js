import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';

export default function Uploader(props) {
	const onDrop = useCallback(acceptedFiles => {
		if (acceptedFiles.length) {
			props.onChange('file', acceptedFiles[0]);
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ onDrop });
	const className = cx('drop-zone', { active: isDragActive, filled: acceptedFiles.length });
	const rootProps = { ...getRootProps(), className: className };
	const inputProps = { ...getInputProps(), multiple: false };
	const text = isDragActive ? 'Завантажити' : (acceptedFiles.length ? acceptedFiles[0].name : '.epub');

	return (
		<div {...rootProps}>
		  <input {...inputProps} />
		  <div className="text">{text}</div>
		</div>
	);
};

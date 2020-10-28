import React from 'react';
import Button from '@material-ui/core/Button'
import { sortableContainer } from 'react-sortable-hoc';
const { __ } = wp.i18n;
/**
 * Addable products container
 *
 * @class AddableProductsContainer
 * @extends {React.Component}
 */
const AddableProductsContainer = (props) => {
	const containerStyles = {
		padding: '5px 0',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
	}

	return (
		<div style={containerStyles}>
			{props.children}

			<Button onClick={() => props.addChoice()}>{__('Add choice', 'kaliforms')}</Button>
		</div>
	);
}

export default sortableContainer(AddableProductsContainer)

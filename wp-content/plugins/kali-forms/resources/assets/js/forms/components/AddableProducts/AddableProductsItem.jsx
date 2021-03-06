import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { sortableElement } from 'react-sortable-hoc';
import AddableProductsItemHandle from './AddableProductsItemHandle'
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionActions from '@material-ui/core/AccordionActions'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
const { __ } = wp.i18n;
/**
 * Addable products item
 *
 * @class AddableProductsItem
 * @extends {React.Component}
 */
const AddableProductsItem = (props) => {
	const [element, setElement] = useState(props.element);
	const [idx, setIdx] = useState(props.idx);
	const [panelCollapsed, setPanelCollapsed] = useState(false);

	useEffect(() => {
		setElement(props.element)
	}, [props.element])


	useEffect(() => {
		setIdx(props.idx)
	}, [props.idx])

	return (
		<Accordion>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<If condition={!panelCollapsed}>
					<AddableProductsItemHandle />
				</If>
				<Typography style={{
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					alignSelf: 'center',
					maxWidth: 230,
					marginRight: 10,
					marginLeft: panelCollapsed ? 0 : 15,
				}}>
					{element.label}
				</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<div style={{ width: '100%' }}>
					<TextField
						label={__('Label', 'kaliforms')}
						value={element.label}
						onChange={e => props.handleChange(e.target.value, 'label', idx)}
						fullWidth={true}
						margin="normal"

					/>
					<TextField
						label={__('Price', 'kaliforms')}
						value={element.price}
						onChange={e => props.handleChange(e.target.value, 'price', idx)}
						fullWidth={true}
						margin="normal"

					/>
				</div>
			</AccordionDetails>
			<Divider />
			<AccordionActions>
				<IconButton onClick={() => props.removeChoice(idx)}>
					<DeleteIcon />
				</IconButton>
			</AccordionActions>
		</Accordion>
	)
}

export default sortableElement(AddableProductsItem)

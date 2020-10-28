import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import PlaceholderDialogOpener from './../PlaceholderDialog/PlaceholderDialogOpener'
import { observer } from "mobx-react-lite";
import { store } from "./../../store/store";
import BootstrapInput from './../BootstrapInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Container from './../LayoutComponents/Container';
import SectionTitle from './../Misc/SectionTitle'
import Checkbox from './../Misc/Checkbox';
import FormControlLabel from './../Misc/FormControlLabel';
import ConditionalThankYouMessage from './../Misc/ConditionalThankYouMessage';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
const { __ } = wp.i18n;
const FormInfo = observer((props) => {
	/**
	 * Returns a boolean, if we have the plugin installed it should be true
	 */
	const saveFormSubmissionsInstalled = () => KaliFormsObject.hasOwnProperty('submissionViewPage');

	return (
		<React.Fragment>
			<Container maxWidth="md">
				<SectionTitle title={__('General settings', 'kaliforms')} />
				<Grid container direction="row" spacing={3}>
					<Grid item xs={6}>
						<FormControl>
							<InputLabel shrink>
								{__('Required field mark', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								value={store._FORM_INFO_.requiredFieldMark}
								onChange={e => store._FORM_INFO_.requiredFieldMark = e.target.value}
								fullWidth={true}
								variant="filled"
								placeholder="(*)"
								inputProps={
									{ maxLength: 5 }
								}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<FormControl>
							<InputLabel shrink>
								{__('Multiple selection separator', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								value={store._FORM_INFO_.multipleSelectionsSeparator}
								onChange={e => store._FORM_INFO_.multipleSelectionsSeparator = e.target.value}
								fullWidth={true}
								variant="filled"
								placeholder={__(", or . or - or whatyouneed", 'kaliforms')}
								inputProps={
									{ maxLength: 5 }
								}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<FormControl>
							<InputLabel shrink>
								{__('Global error message', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								value={store._FORM_INFO_.globalErrorMessage}
								onChange={e => store._FORM_INFO_.globalErrorMessage = e.target.value}
								fullWidth={true}
								variant="filled"
								placeholder={__("Something went wrong...", 'kaliforms')}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={9}>
						<FormControl>
							<InputLabel shrink>
								{__('Form action', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								value={store._FORM_INFO_.formAction}
								onChange={e => store._FORM_INFO_.formAction = e.target.value}
								fullWidth={true}
								variant="filled"
								placeholder={__("Form action", 'kaliforms')}
							/>
							<FormHelperText>
								{__('The form action controls where the collected information will be submitted to (this is optional, and overrides the default form submission process).', 'kaliforms')}
							</FormHelperText>
						</FormControl>
					</Grid>
					<Grid item xs={3}>
						<FormControl>
							<InputLabel shrink>
								{__('Form method', 'kaliforms')}
							</InputLabel>
							<Select
								value={store._FORM_INFO_.formMethod}
								multiple={false}
								onChange={e => store._FORM_INFO_.formMethod = e.target.value}
								input={<BootstrapInput />}
							>
								<MenuItem value='GET'>GET</MenuItem>
								<MenuItem value='POST'>POST</MenuItem>
							</Select>
						</FormControl>
					</Grid>
				</Grid>

				<Grid container direction="row" spacing={3}>
					<Grid item xs={12}>
						<FormGroup>
							<FormControlLabel
								control={
									<Checkbox
										checked={store._FORM_INFO_.hideFormName === '1'}
										onChange={e => store._FORM_INFO_.hideFormName = e.target.checked ? '1' : '0'}
									/>
								}
								label={__('Hide form name', 'kaliforms')}
							/>
						</FormGroup>
					</Grid>
				</Grid>

				<SectionTitle title={__('After form submit', 'kaliforms')} />
				<Grid container direction="row" spacing={3}>
					<Choose>
						<When condition={typeof KaliFormsObject.conditionalLogic !== 'undefined'}>
							<ConditionalThankYouMessage />
						</When>
						<Otherwise>
							<Grid item>
								<FormGroup>
									<FormControlLabel
										control={
											<Checkbox
												checked={store._FORM_INFO_.showThankYouMessage === '1'}
												onChange={e => store._FORM_INFO_.showThankYouMessage = e.target.checked ? '1' : '0'}
											/>
										}
										label={__('Show thank you message', 'kaliforms')}
									/>
								</FormGroup>
							</Grid>
							<If condition={store._FORM_INFO_.showThankYouMessage === '1'}>
								<Grid item xs={12}>
									<FormControl>
										<InputLabel shrink>
											{__('Thank you message', 'kaliforms')}
										</InputLabel>
										<BootstrapInput
											value={store._FORM_INFO_.thankYouMessage}
											onChange={e => store._FORM_INFO_.thankYouMessage = e.target.value}
											// multiline={true}
											variant="filled"
											fullWidth={true}
											style={{ whiteSpace: 'pre' }}
											endAdornment={(
												<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
											)}
										/>
									</FormControl>
								</Grid>
							</If>
						</Otherwise>
					</Choose>
				</Grid>
				<Grid container direction="row" spacing={3}>
					<Grid item>
						<FormGroup>
							<FormControlLabel
								control={
									<Checkbox
										checked={store._FORM_INFO_.saveFormSubmissions === '1'}
										onChange={e => store._FORM_INFO_.saveFormSubmissions = e.target.checked ? '1' : '0'}
									/>
								}
								label={__('Save form submissions', 'kaliforms')}
							/>
						</FormGroup>
					</Grid>
					<If condition={saveFormSubmissionsInstalled() && store._FORM_INFO_.saveFormSubmissions === '1'}>
						<Grid item xs={12}>
							<FormControl>
								<InputLabel shrink>
									{__('Entries view page (page with [kaliform-submission] shortcode)', 'kaliforms')}
								</InputLabel>
								<BootstrapInput
									value={store._FORM_INFO_.submissionViewPage}
									type="url"
									onChange={e => store._FORM_INFO_.submissionViewPage = e.target.value}
									fullWidth={true}
									variant="filled"
								/>
							</FormControl>
						</Grid>
					</If>

					<Grid item xs={12}>
						<FormControl>
							<InputLabel shrink>
								{__('Redirect URL', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								value={store._FORM_INFO_.redirectUrl}
								type="url"
								onChange={e => store._FORM_INFO_.redirectUrl = e.target.value}
								fullWidth={true}
								variant="filled"
								placeholder="www.google.com"
							/>
						</FormControl>
					</Grid>
				</Grid>

				<SectionTitle title={__('Form class and id', 'kaliforms')} />
				<Grid container direction="row" spacing={3}>
					<Grid item xs={6}>
						<FormControl>
							<InputLabel shrink>
								{__('CSS Id', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								value={store._FORM_INFO_.cssId}
								onChange={e => store._FORM_INFO_.cssId = e.target.value}
								fullWidth={true}
								variant="filled"
							/>
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<FormControl>
							<InputLabel shrink>
								{__('CSS Class', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								value={store._FORM_INFO_.cssClass}
								onChange={e => store._FORM_INFO_.cssClass = e.target.value}
								fullWidth={true}
								variant="filled"
							/>
						</FormControl>
					</Grid>
				</Grid>
			</Container>
		</React.Fragment>
	);
})
export default FormInfo;

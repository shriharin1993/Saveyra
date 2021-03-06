import axios from 'axios';
import Qs from 'qs';
import maskInput from 'vanilla-text-mask'
import PaymentHelper from './payment-helper.js';
const { __ } = wp.i18n;

export default class FormProcessor {
	/**
	 * Get initial load
	 */
	get initialLoaded() {
		return this._initialLoaded;
	}
	/**
	 * Set initial load
	 */
	set initialLoaded(state) {
		state ? this.form.classList.add('fade-in-bck') : '';
		return this._initialLoaded = state;
	}
	/**
	 * Sets loading state of the form
	 *
	 * @memberof FormProcessor
	 */
	set loading(value) {
		this._loading = value;
		value ? this.appendLoader() : this.removeLoader()
	}
	/**
	 * Get loading state
	 *
	 * @memberof FormProcessor
	 */
	get loading() {
		return this._loading;
	}
	/**
	 * Error message
	 * @memberof FormProcessor
	 * @param {string} value
	 */
	set errorMessage(value) {
		this._errorMessage = value;
		document.getElementById(`kaliforms-global-error-message-${this.formId}`).innerText = value;
	}
	/**
	 * Returns the error message
	 *
	 * @readonly
	 * @memberof FormProcessor
	 */
	get errorMessage() {
		return document.getElementById(`kaliforms-global-error-message-${this.formId}`).innerText
	}
	/**
	 * Check if the form elements are all valid
	 *
	 * @readonly
	 * @memberof FormProcessor
	 */
	get valid() {
		let checks = { formValidation: true };
		if (this.grecaptcha) {
			checks = { ...checks, recaptcha: this.grecaptchaValidation }
			if (!checks.recaptcha) {
				this.errorMessage = __('Please complete recaptcha challenge', 'kaliforms');
			}
		}

		if (this.editors.length) {
			this.editors.map(e => {
				let required = e.getAttribute('data-was-required');
				if (required === 'true' && e.value === '') {
					checks.formValidation = false;
				}
			})
		}

		if (this.hasOwnProperty('digitalSignatures') && this.digitalSignatures.length) {
			this.digitalSignatures.map(signature => {
				let required = signature.input.hasAttribute('required');
				if (required && signature.input.value === '') {
					checks.formValidation = false;
					signature.handler.triggerError();
				}
			})
		}

		if (Object.keys(this.checkboxes).length) {
			for (let key in this.checkboxes) {
				let group = this.checkboxes[key];
				if (!group.required) {
					continue;
				}

				group.fields.map(field => group.valid = group.valid ? true : field.checked)
			}


			for (let key in this.checkboxes) {
				let group = this.checkboxes[key];
				if (group.required && !group.valid) {
					checks.formValidation = false;
					group.fields.map((field, idx) => {
						if (idx === 0) {
							field.setAttribute('required', 'true');
							this.form.reportValidity()

							setTimeout(() => field.removeAttribute('required'), 1000)
						}
					})
				}
			}
		}

		if (this.hasOwnProperty('akismet')) {
			checks.formValidation = !this.akismet
		}

		if (this.honeypot) {
			this.honeypotFields.map(e => {
				if (e.value !== '') {
					checks.formValidation = false;
				}
			});
		}

		return this.grecaptcha ? (checks.formValidation && checks.recaptcha) : checks.formValidation
	}

	/**
	 * Class constructor
	 * @param {*} nodeElement
	 * @memberof FormProcessor
	 */
	constructor(nodeElement) {
		this.attachInitialLoadevent();
		this.id = nodeElement.getAttribute('id');
		this.style = nodeElement.getAttribute('data-form-style');
		this.formId = parseInt(nodeElement.getAttribute('data-form-id'));
		this.form = nodeElement;
		this.formElements = this.form.elements;
		this.uploadFields = [];
		this.editors = [];
		this.checkboxes = {};
		this.nonce = KaliFormsObject.ajax_nonce;
		this.globalErrorMessage = this.errorMessage;

		this.submitButton = this.form.querySelector('input[type=submit]');

		// We need preflight for AKISMET ( for now, we should add here whatever we need )
		this.preFlightNeeded = KaliFormsObject.akismetEnabled !== '0';

		// AJAX RELATED
		this.axios = axios;
		this.Qs = Qs;

		this.checkHoneypot();

		// Enable styling
		this.enableStyling();

		// Enable javascript
		this.handleCheckboxes();
		this.handleEditors();
		this.handleInputMasks();
		this.handleFileUploads();
		this.handleRecaptcha();
		this.handlePayments(PaymentHelper);

		// Init paypal
		if (typeof paypal !== 'undefined') {
			this.handlePayPalPayment(paypal);
		}

		this.handleSubmit();

		document.dispatchEvent(new CustomEvent('kaliFormProcessConstructed', { detail: this }))
	}
	/**
	 * Attaches an initial load event
	 */
	attachInitialLoadevent() {
		this.initialLoaded = false;
		document.addEventListener('kaliFormProcessConstructed', e => {
			this.initialLoaded = true;
		})
	}
	/**
	 * Check honey pot
	 */
	checkHoneypot() {
		let nameHp = document.getElementById('kf-name-field');
		let emailHp = document.getElementById('kf-email-field');

		if (nameHp !== null && emailHp !== null) {
			this.honeypotFields = [
				nameHp,
				emailHp,
			]

			this.honeypot = true;
			return;
		}

		this.honeypot = false;
	}

	/**
	 * Formats the element as we need them
	 */
	enableStyling() {
		switch (this.style) {
			case 'inputLabelMerge':
				[...this.formElements].map(e => {
					if (e.tagName === 'BUTTON') {
						return;
					}
					if (['hidden', 'checkbox', 'radio', 'button', 'submit', 'file'].includes(e.getAttribute('type'))) {
						return
					}

					const wrapper = this.wrapAll(e.parentNode)
					wrapper.classList.add(this.style);
				});
				break;
			case 'inputLabelMergeOverlap':
				[...this.formElements].map(e => {
					if (e.tagName === 'BUTTON') {
						return;
					}

					if (['hidden', 'button', 'submit', 'file'].includes(e.getAttribute('type'))) {
						return
					}
					if (['checkbox', 'radio'].includes(e.getAttribute('type'))) {
						const parentNode = e.parentNode.parentNode;
						if (parentNode.classList.contains(this.style)) {
							return;
						}

						const wrapper = this.wrapAll(e.parentNode.parentNode)
						wrapper.classList.add(this.style);
						wrapper.classList.add('checkbox-radio');
						return;
					}

					const wrapper = this.wrapAll(e.parentNode)
					wrapper.classList.add(this.style);
				});
				break;
			default: break;
		}
	}
	/**
	 *
	 * @param {DOMElement} target
	 * @param {DOMElement} wrapper
	 */
	wrapAll(target, wrapper = document.createElement('div')) {
		[...target.childNodes].forEach(child => wrapper.appendChild(child))
		target.appendChild(wrapper)
		return wrapper
	}
	/**
	 * Handles checkboxes required status when there is a group
	 *
	 * @memberof FormProcessor
	 */
	handleCheckboxes() {
		let fields = this.form.querySelectorAll('input[type=checkbox]');
		let groups = {};

		[...fields].map(e => {
			let name = e.getAttribute('name');

			if (!groups.hasOwnProperty(name)) {
				groups[name] = {
					required: e.hasAttribute('required') ? true : false,
					valid: false,
					fields: []
				};
			};
			e.setAttribute('data-was-required', e.hasAttribute('required') ? true : false);
			e.removeAttribute('required');

			groups[name].fields.push(e);
			groups[name].valid = groups[name].valid ? true : e.checked
		});

		this.checkboxes = groups;
	}

	/**
	 * Handle editors
	 */
	handleEditors() {
		if (!window.hasOwnProperty('wp') || !wp.hasOwnProperty('editor') || typeof wp.editor.getDefaultSettings !== 'function') {
			return;
		}
		let fields = this.form.querySelectorAll('textarea[editor]');

		[...fields].map(e => {
			let id = e.getAttribute('id');
			if (id === null) {
				id = e.getAttribute('data-internal-id')
				e.setAttribute('id', id)
			}
			e.setAttribute('data-was-required', e.hasAttribute('required') ? true : false);
			e.removeAttribute('required');
			this.editors.push(e);
			wp.editor.initialize(id, {
				tinymce: {
					wpautop: false,
					plugins: 'charmap colorpicker compat3x directionality fullscreen hr image lists media paste tabfocus textcolor wordpress wpautoresize wpdialogs wpeditimage wpemoji wpgallery wplink wptextpattern wpview',
					toolbar1: 'formatselect bold italic | bullist numlist | blockquote | alignleft aligncenter alignright | link unlink | spellchecker',
					setup: editor => editor.on('change', () => {
						let event = new Event('change');
						e.dispatchEvent(event);
						editor.save()
					}),
				},
				quicktags: true,
			})
		})
	}

	/**
	 * Adds input masks where needed
	 */
	handleInputMasks() {
		let fields = this.form.querySelectorAll("[data-format]");

		let masks = {
			'us': ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
			'usWithCode': ['+', '1', ' ', /[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
		};

		[...fields].map(field => {
			let mask = field.getAttribute('data-format');
			if (masks.hasOwnProperty(mask)) {
				maskInput({
					inputElement: field,
					mask: masks[mask],
					guide: true,
					showMask: true,
				})
			}
		});
	}

	/**
	 * Create functions from mixin
	 *
	 * @param {*} PaymentHelper
	 * @memberof FormProcessor
	 */
	handlePayments(PaymentHelper) {
		for (let key in PaymentHelper) {
			this[key] = PaymentHelper[key].bind(this)
		}

		this.payments = null;
		this.paymentForm = true;
	}

	/**
	 * Handles file uploads
	 */
	handleFileUploads() {
		let fields = this.form.querySelectorAll("[type='file']");

		if (typeof FilePond === 'undefined') {
			return;
		}

		[...fields].map(field => {
			let pond = FilePond.create(field);

			this.uploadFields.push(field.getAttribute('name'));
			const options = {
				/**
				 * Required field attribute
				 */
				required: field.hasAttribute('required'),
				/**
				 * Name of the field
				 */
				name: field.getAttribute('name'),
				/**
				 * Is the field disabled?
				 */
				disabled: field.hasAttribute('readonly'),
				/**
				* In case we allow image preview
				*/
				allowImagePreview: field.hasAttribute('imagepreview'),
				/**
				 * Max file size
				 */
				maxFileSize: field.getAttribute('data-maxfilesize'),
				/**
				 * Instant upload files to the server
				 */
				instantUpload: field.hasAttribute('instantupload'),
				/**
				 * File type validation
				 */
				acceptedFileTypes: field.getAttribute('data-acceptedextensions') !== null ? field.getAttribute('data-acceptedextensions').split(',') : null,
				/**
				 * Add a file prefix
				 */
				fileRenameFunction: (file) => {
					let prefix = field.getAttribute('data-fileprefix')
					return prefix !== null ? `${prefix}${file.name}` : file.name;
				},
				/**
				 * Callback when field is ready to use
				 */
				oninit: () => document.dispatchEvent(new CustomEvent('kaliFormUploadFieldInit', {
					detail: { name: field.getAttribute('name'), instance: pond }
				}))
			}

			pond.setOptions(options);
		});
	}

	/**
	 * Handles recaptcha
	 */
	handleRecaptcha() {
		this.grecaptcha = false;
		let grecaptchas = document.querySelectorAll("[data-field-type='grecaptcha']")
		grecaptchas = [...grecaptchas];
		if (!grecaptchas.length) {
			return;
		}
		if (typeof grecaptcha === 'undefined') {
			return;
		}

		this.grecaptcha = true;
		grecaptcha.ready(() => {
			grecaptchas.map(e => {
				grecaptcha.render(e.getAttribute('id'),
					{
						sitekey: e.getAttribute('data-sitekey'),
						callback: this.verifyRecaptchaCallback.bind(this)
					}
				)
			})
		})
	}

	/**
	 * Verifies if the recaptcha is valid
	 * @param {String} res
	 */
	verifyRecaptchaCallback(res) {
		const data = { action: 'kaliforms_form_verify_recaptcha', data: { formId: this.formId, nonce: this.nonce, token: res } };
		this.submitButton.setAttribute('disabled', 'disabled');
		this.axios.post(KaliFormsObject.ajaxurl, this.Qs.stringify(data))
			.then(r => {
				this.submitButton.removeAttribute('disabled');
				if (r.data.hasOwnProperty('error')) {
					this.throwError();
				} else {
					this.grecaptchaValidation = r.data.response.success;
				}
			})
			.catch(e => {
				console.log(e);
			});
	}

	/**
	 * Sets up validation
	 *
	 * @memberof FormProcessor
	 */
	setupValidation() {
		// console.log(Validate)
		// console.log('setting up validation')
	}

	/**
	 * Preflight request
	 */
	preFlightRequest() {
		const data = {
			action: 'kaliforms_preflight', data: {
				formId: this.formId,
				nonce: this.nonce,
				data: this._getFormData()
			}
		}

		return this.axios.post(KaliFormsObject.ajaxurl, this.Qs.stringify(data))
	}


	/**
	 * Handles form submit
	 *
	 * @memberof FormProcessor
	 */
	handleSubmit() {
		this.form.addEventListener('submit', async evt => {
			evt.preventDefault()
			document.getElementById(`kaliforms-global-error-message-${this.formId}`).style.display = 'none';
			this.errorMessage = this.globalErrorMessage;
			this.loading = true;

			this.preFlightNeeded
				? this.preFlightRequest()
					.then(r => {
						for (let key in r.data) {
							this[key] = r.data[key]
						}

						this.valid ? this.makeRequest() : this.throwError();
					})
					.catch(e => {
						console.log(e);
					})
				: this.valid ? this.makeRequest() : this.throwError();

		}, true)
	}

	/**
	 * Throw error if form is not valid
	 */
	throwError() {
		document.getElementById(`kaliforms-global-error-message-${this.formId}`).style.display = 'block';
		this.loading = false;
	}

	/**
	 * Makes ajax request
	 *
	 * @memberof FormProcessor
	 */
	makeRequest() {
		let action = this.form.getAttribute('action');
		if (action !== null) {
			document.createElement('form').submit.call(this.form);
			return;
		}

		const data = { action: 'kaliforms_form_process', data: this._getFormData(), extraArgs: this._getExtra() };

		if (this.paymentForm) {
			data.payments = this.payments;
		}

		axios.post(KaliFormsObject.ajaxurl, Qs.stringify(data))
			.then(r => {
				if (r.data.hasOwnProperty('error')) {
					this.throwError();
					document.dispatchEvent(new CustomEvent('kaliformProcessError', { detail: this }))
				} else {
					if (r.data.hasOwnProperty('terminated') && r.data.terminated) {
						if (r.data.hasOwnProperty('terminated_reason')) {
							this.errorMessage = r.data.terminated_reason;
						}
						this.throwError();
						return;
					}
					this.loading = false;
					this.showThankYouMessage(r.data)
					document.dispatchEvent(new CustomEvent('kaliformShownThankYouMessage', { detail: this }))

					if (r.data.hasOwnProperty('redirect_url') && r.data.redirect_url !== '') {
						setTimeout(() => window.location.href = r.data.redirect_url, 5000)
					}
				}
			})
			.catch(e => {
				console.log(e);
			});
	}
	/**
	 * We use this object only for field uploads at the moment
	 */
	_getExtra() {
		return this.uploadFields
	}
	/**
	 * Gets form data
	 *
	 * @memberof FormProcessor
	 */
	_getFormData() {
		let arr = {
			formId: this.formId,
			nonce: this.nonce,
		};
		[...this.formElements].map(e => {
			let type = e.getAttribute('type');
			switch (type) {
				case 'checkbox':
					let values = [];
					[...document.getElementsByName(e.getAttribute('name'))].map(el => el.checked ? values.push(el.value) : false)
					arr[e.getAttribute('name')] = values
					break;
				case 'radio':
					let value = '';
					[...document.getElementsByName(e.getAttribute('name'))].map(el => el.checked ? value = el.value : false)
					arr[e.getAttribute('name')] = value
					break;
				case 'submit':
					break;
				case 'choices':
					let selected = e.querySelectorAll('option:checked');
					arr[e.getAttribute('name')] = Array.from(selected).map(el => el.value);
					break;
				default:
					if (e.getAttribute('name') !== null) {
						arr[e.getAttribute('name')] = e.value
					}
					break;
			}
		})

		return arr;
	}
	/**
	 * Shows the thank you message
	 *
	 * @param {*} response
	 * @memberof FormProcessor
	 */
	showThankYouMessage(response) {
		this.form.classList.add('fade-out-top');

		let animationEvent = this.whichAnimationEvent();
		animationEvent && this.form.addEventListener(animationEvent, () => {
			this.form.insertAdjacentHTML('beforebegin', `<div id="kaliforms-thank-you-message">${response.thank_you_message}</div>`);
			this.form.parentNode.removeChild(this.form)
		});


	}
	/**
	 * Appends loader
	 *
	 * @memberof FormProcessor
	 */
	appendLoader() {
		this.form.classList.add('kaliform-loading');
		let loader = '<div id="kaliform-loader-container" class="kaliform-loader-container"><div class="kaliform-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';
		this.form.insertAdjacentHTML('beforeend', loader);
	}
	/**
	 * Removes loader
	 *
	 * @memberof FormProcessor
	 */
	removeLoader() {
		let loader = document.getElementById('kaliform-loader-container');
		this.form.classList.remove('kaliform-loading');
		this.form.removeChild(loader);
	}

	/**
	 * Is the form valid ?
	 *
	 * @returns
	 * @memberof FormProcessor
	 */
	validForm() {
		let cont = true;
		[...this.formElements].map(e => {
			if (!e.checkValidity()) {
				cont = false;
			}
		});
		// this.valid = cont;
		return cont;
	}

	/**
	 * Cross Browser compatibility for animation end
	 *
	 * @param {*} element
	 * @param {*} type
	 * @param {*} callback
	 * @memberof FormProcessor
	 */
	whichAnimationEvent() {
		let t;
		let el = document.createElement('fakeelement');
		let transitions = {
			'animation': 'animationend',
			'OAnimation': 'oAnimationEnd',
			'MozAnimation': 'animationend',
			'WebkitAnimation': 'webkitAnimationEnd'
		}

		for (t in transitions) {
			if (el.style[t] !== undefined) {
				return transitions[t];
			}
		}
	}
}

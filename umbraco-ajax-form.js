class UmbracoAjaxForm {

	constructor(formGuid, options) {
		this.steps = []
		this.formGuid = formGuid

		// Setup options with fallbacks
		this.options = Object.assign({
			onsuccess() { return true },
			onerror() { return true }
		}, options)

		this.currentStep = $(this.selector)
	}

	get selector() {
		return `#contour_form_${this.formGuid.replace(/-/g, '')} form`
	}

	get currentStep() {
		return this.steps[this.currentStepIndex]
	}

	get previousStep() {
		return this.steps[this.currentStepIndex - 1]
	}

	set currentStep(form) {
		const previousButton = form.find('input[name="__prev"]')

		// Set type to button so submitting by hitting
		// return doesn't cause a step back
		previousButton.attr('type', 'button')

		this.currentStepIndex = parseInt( form.find('input[name="FormStep"]').val() )
		this.steps[this.currentStepIndex] = form

		form[0].onsubmit = this.handleSubmit.bind(this)
		previousButton.on('click', this.goToPrevious.bind(this))
	}

	/* 
	 * Handles the submit event fired when clicking `next` and `submit`
	 * 
	 * @param event | The submit event
	 * @return options.onsubmit {Function}
	 */
	handleSubmit(event) {
		const form = this.currentStep
		const submitted = form.data('submitted')
		const action = form.attr('action')
		const method = form.attr('method')
		const data = form.serialize()

		event.preventDefault()

		if (submitted || !form.valid()) { return true }

		form.data('submitted', true)

		$.ajax({
			url: action,
			method: method,
			data: data
		})
		.done(this.handleSuccess.bind(this))
		.fail(this.handleError.bind(this))
	}

	/* 
	 * Replaces current step in view with previous from steps array
	 * 
	 * @param event | The submit event
	 * @return replaced {Boolean}
	 */
	goToPrevious(event) {
		event.preventDefault()

		this.previousStep
			.find('input[disabled="disabled"]')
			.prop('disabled', false)

		this.previousStep
			.find('input[name="__prev"]')
			.on('click', this.goToPrevious.bind(this))
		
		this.previousStep[0].onsubmit = this.handleSubmit.bind(this)

		this.previousStep.data('submitted', false)

		this.currentStep.replaceWith(this.previousStep)

		this.currentStep = this.previousStep
	}

	handleSuccess(data) {
		const message = $(data).find('.contourMessageOnSubmit').text()
		let nextStep = $(data).find(this.selector)
		const nextStepIndex = parseInt( nextStep.find('input[name="FormStep"]').val() )

		// If there's a form in the response then 
		// it's the next page in the form and should be showed
		if (nextStep.length) {
			nextStep = this.steps[nextStepIndex] || nextStep

			this.currentStep.replaceWith(nextStep)
			this.currentStep = nextStep
		} else {
			return this.options.onsuccess.call(this.currentStep[0], message)
		}
	}

	handleError(jqHXR, textStatus, error) {
		return options.onerror.call(this.currentSteo[0], error)
	}

}

export default UmbracoAjaxForm
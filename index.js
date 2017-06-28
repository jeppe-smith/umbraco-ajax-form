(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports);
		global.umbracoAjaxForm = mod.exports;
	}
})(this, function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	var UmbracoAjaxForm = function () {
		function UmbracoAjaxForm(formGuid, options) {
			_classCallCheck(this, UmbracoAjaxForm);

			this.steps = [];
			this.formGuid = formGuid;

			// Setup options with fallbacks
			this.options = Object.assign({
				onsuccess: function onsuccess() {
					return true;
				},
				onerror: function onerror() {
					return true;
				}
			}, options);

			this.currentStep = $(this.selector);
		}

		_createClass(UmbracoAjaxForm, [{
			key: 'handleSubmit',
			value: function handleSubmit(event) {
				var form = this.currentStep;
				var submitted = form.data('submitted');
				var action = form.attr('action');
				var method = form.attr('method');
				var data = form.serialize();

				event.preventDefault();

				if (submitted || !form.valid()) {
					return true;
				}

				form.data('submitted', true);

				$.ajax({
					url: action,
					method: method,
					data: data
				}).done(this.handleSuccess.bind(this)).fail(this.handleError.bind(this));
			}
		}, {
			key: 'goToPrevious',
			value: function goToPrevious(event) {
				event.preventDefault();

				this.previousStep.find('input[disabled="disabled"]').prop('disabled', false);

				this.previousStep.find('input[name="__prev"]').on('click', this.goToPrevious.bind(this));

				this.previousStep[0].onsubmit = this.handleSubmit.bind(this);

				this.previousStep.data('submitted', false);

				this.currentStep.replaceWith(this.previousStep);

				this.currentStep = this.previousStep;
			}
		}, {
			key: 'handleSuccess',
			value: function handleSuccess(data) {
				var message = $(data).find('.contourMessageOnSubmit').text();
				var nextStep = $(data).find(this.selector);
				var nextStepIndex = parseInt(nextStep.find('input[name="FormStep"]').val());

				// If there's a form in the response then 
				// it's the next page in the form and should be showed
				if (nextStep.length) {
					nextStep = this.steps[nextStepIndex] || nextStep;

					this.currentStep.replaceWith(nextStep);
					this.currentStep = nextStep;
				} else {
					return this.options.onsuccess.call(this.currentStep[0], message);
				}
			}
		}, {
			key: 'handleError',
			value: function handleError(jqHXR, textStatus, error) {
				return options.onerror.call(this.currentSteo[0], error);
			}
		}, {
			key: 'selector',
			get: function get() {
				return '#contour_form_' + this.formGuid.replace(/-/g, '') + ' form';
			}
		}, {
			key: 'currentStep',
			get: function get() {
				return this.steps[this.currentStepIndex];
			},
			set: function set(form) {
				var previousButton = form.find('input[name="__prev"]');

				// Set type to button so submitting by hitting
				// return doesn't cause a step back
				previousButton.attr('type', 'button');

				this.currentStepIndex = parseInt(form.find('input[name="FormStep"]').val());
				this.steps[this.currentStepIndex] = form;

				form[0].onsubmit = this.handleSubmit.bind(this);
				previousButton.on('click', this.goToPrevious.bind(this));
			}
		}, {
			key: 'previousStep',
			get: function get() {
				return this.steps[this.currentStepIndex - 1];
			}
		}]);

		return UmbracoAjaxForm;
	}();

	exports.default = UmbracoAjaxForm;
});

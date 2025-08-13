document.addEventListener('DOMContentLoaded', () => {
	const forms = document.querySelectorAll('.needs-validation');

	forms.forEach((form) => {
		const inputs = form.querySelectorAll('input, textarea');

		const updateValidationState = (input) => {
			const validFeedback =
				input.parentElement.querySelector('.valid-feedback');
			const invalidFeedback =
				input.parentElement.querySelector('.invalid-feedback');

			const isEmptyRequired =
				input.hasAttribute('required') && !input.value.trim();

			const isValid = !isEmptyRequired && input.checkValidity();

			input.classList.remove(
				'border-gray-300',
				'border-red-500',
				'border-green-500'
			);
			validFeedback?.classList.add('hidden');
			invalidFeedback?.classList.add('hidden');

			if (!isValid) {
				input.classList.add('border-red-500');
				invalidFeedback?.classList.remove('hidden');
				return;
			}

			input.classList.add('border-green-500');
			validFeedback?.classList.remove('hidden');
		};

		inputs.forEach((input) => {
			input.addEventListener('blur', () => updateValidationState(input));
			input.addEventListener('input', () => {
				if (form.classList.contains('was-validated')) {
					updateValidationState(input);
				}
			});
		});

		form.addEventListener('submit', (event) => {
			if (!form.checkValidity()) {
				event.preventDefault();
				event.stopPropagation();
			}

			form.classList.add('was-validated');
			inputs.forEach(updateValidationState);
		});
	});
});

// Store query selectors to shorten code, basically ape jQuery a bit
const $ = document.querySelector.bind(document);

// I can probably use this ($$) to assign the dom nodes currently stored individually below, instead to a singular array and then just run the forEach on that named array, rather than using the destructuring [x, y, z] = [$('.x'), $('.y'), $('.z')] method
// However, I'm  going to leave this as is for now, though. In case I find that I need more control over the individual nodes.
const $$ = document.querySelectorAll.bind(document);

// topNav for making mobile nav hide on scroll
// assign this on it's own if I decide to use the $$ to create an array for all the elements affected by the .open class
// const topNav = $('.navigation');

// Elements for opening and closing mobile menu
// Making use of destructuring to assign nodes to variables
const [topNav, hamburger, menu, socialMenu, body] = [
	$('.navigation'),
	$('.menu-button'),
	$('.menu-list'),
	$('.social-list'),
	$('body'),
];

// store page section for intersection observer
const sections = $$(['.header', '.section']);

// Store form element
const contactForm = $('#contact-form');


//
let fieldsArray;
const fieldNodes = $$('.form-control');
fieldsArray = [...fieldNodes].map(node => ({
	control: node,
	input: node.children[0],
	name: node.children[0].name,
	value: node.children[0].value.trim(),
	label: node.children[1],
	errorEl: node.children[0].labels[0].querySelector('.input-error'),
	errors: [],
	// children: node.children,
}));

console.log(fieldsArray);
// Store form inputs for touched status
const formControls = $$('.form-control');

const formInputs = $$('.form-input');

// Store the menu anchors to apply menu close onClick and active link styling
const menuLinks = $$('.menu-anchor');

// toggle the open class for the mobile menu
const toggleMenu = () => {
	[hamburger, menu, socialMenu, body].forEach(el =>
		el.classList.toggle('open')
	);
};

//Function to set input as touched
// data-touched="" will be used for onSubmit validation/restriction
// const setTouched = event => (event.target.dataset.touched = 'true');
const setTouched = input => (input.dataset.touched = 'true');

// Function to set invalid field
const setError = field => {
	// data-valid="" will be used for onSubmit validation/restriction
	field.input.dataset.valid = false;
	field.errorEl.innerText = field.errors;
	field.errorEl.classList.add('active');
};

// Function to set valid field
const setSuccess = field => {
	// data-valid="" will be used for onSubmit validation/restriction
	field.input.dataset.valid = true;
	field.errorEl.classList.remove('active');
};

// Create object containing all elements attributes to be manipulated and used
// function collectField(inputEl) {
// 	const fieldObject = {
// 		input: inputEl,
// 		name: inputEl.name,
// 		value: inputEl.value.trim(),
// 		control: inputEl.parentElement,
// 		label: inputEl.labels[0],
// 		errorEl: inputEl.labels[0].querySelector('.input-error'),
// 		errors: [], // errors from failed validation will be spread here
// 	};

// 	console.log(fieldObject);

// 	// Return object to variable
// 	return fieldObject;
// }

const validateMinMax = (field, min, max) => {
	let length = field.input.value.length;
	let errMsg = `${field.name} must be between ${min} and ${max} characters.`;
	if (length < min || length > max) {
		field.errors = [...field.errors, errMsg];
		// console.trace(`name length errors::: ${field.errors}`);
	}
};

// E-mail Regex Validation
const validateEmail = field => {
	let value = field.input.value;
	const emailRegExp = new RegExp(
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
	);
	let errMsg = `${field.name} must be of valid format.`;

	if (!emailRegExp.test(value)) {
		field.errors = [...field.errors, errMsg];
	}
};

// Validate inputs

// const inputValidate = (field) => {
// 	// console.log(event)
// 	console.log(field)
// 	setTouched(field.input);
// 	// const field = collectField(e.target);

// 	// Use switch function to choose which validation functions are invoked, based on the field name
// 	// Built this wait to allow me to scale and test/add different functions to the process easily
// 	switch (field.name) {
// 		case 'name':
// 			validateMinMax(field, 2, 30);
// 			break;
// 		case 'email':
// 			validateMinMax(field, 6, 40);
// 			validateEmail(field);
// 			break;
// 		case 'phone':
// 			validateMinMax(field, 0, 15);
// 			break;
// 		case 'message':
// 			validateMinMax(field, 30, 500);
// 			break;
// 	}

// 	if (field.errors.length !== 0) {
// 		console.log(field.errors.length !== 0);
// 		setError(field);
// 	} else {
// 		console.log(field.errors.length === 0);
// 		setSuccess(field);
// 	}
// };


const fieldValidate = (field) => {
	// console.log(event)
	// console.trace(field)

	setTouched(field.input);
	// const field = collectField(e.target);

	// Use switch function to choose which validation functions are invoked, based on the field name
	// Built this wait to allow me to scale and test/add different functions to the process easily
	switch (field.name) {
		case 'name':
			validateMinMax(field, 2, 30);
			break;
		case 'email':
			validateMinMax(field, 6, 40);
			validateEmail(field);
			break;
		case 'phone':
			validateMinMax(field, 0, 15);
			break;
		case 'message':
			validateMinMax(field, 30, 500);
			break;
	}

	if (field.errors.length !== 0) {
		console.log(field.errors.length !== 0);
		setError(field);
	} else {
		console.log(field.errors.length === 0);
		setSuccess(field);
	}

	field.errors = [];
};

// Handling contact form submit
const handleSubmit = e => {
	e.preventDefault();
	console.log('Testing Submit');
	let touchedInputs = [];
	let invalidInputs = [];
	formInputs.forEach(input => {
		// console.table([
		// 	['Touched?', input.dataset.touched],
		// 	['Valid?', input.dataset.valid],
		// ]);
		// console.log('Includes touched?', input.dataset.touched.includes(true));
		// console.log('Includes valid?', input.dataset.valid.includes(true));
		if (input.name !== 'last-name') {
			console.log(input);
			touchedInputs = [...touchedInputs, input.dataset.touched];
			invalidInputs = [...invalidInputs, input.dataset.valid];
		}
	});

	console.log(touchedInputs);
	console.log(invalidInputs);

	//WOW this is ugly, I need to work on this a bit, but the concept is there...

	if (!touchedInputs.includes('true')) {
		contactForm.classList.add('invalid');
		contactForm.querySelector('.form-error').innerText =
			'You can not submit an empty form.';
	}

	if (!touchedInputs.includes('true') && !invalidInputs.includes('false')) {
		contactForm.classList.add('invalid');
		contactForm.querySelector('.form-error').innerText =
			'Quit being weird, how did you do that?';
	}

	if (touchedInputs.includes('true') && invalidInputs.includes('false')) {
		contactForm.classList.add('invalid');
		contactForm.querySelector('.form-error').innerText =
			'Make sure you fill out the required fields, please :)';
	}

	if (touchedInputs.includes('true') && !invalidInputs.includes('false')) {
		contactForm.classList.add('invalid');
		contactForm.querySelector('.form-error').innerText = 'Huzzah';
	}
};

// function to update the history pushstate, but set a timeout to avoid this being triggered through rapid user scrolling
const updateHistory = hash => {
	clearTimeout(updateHistory.timeout);
	updateHistory.timeout = setTimeout(() => {
		if (window.location.hash !== hash) {
			history.pushState({}, window.title, hash);
		}
	}, 1000);
};

// Will work on this debounce later for recalculating intersections on resize
// const debounce = (fn, time) => {
// 	clearTimeout(fn.timeout);
// 	fn.timeout = setTimeOut(fn(), time);
// };

const findThreshold = element => {
	// console.log(element.id, (window.innerHeight / 2 / element.clientHeight));
	// console.log(element.clientHeight);
	// console.log(window.innerHeight);
	// console.log(window.innerHeight / 2);
	// console.log(window.innerHeight / 2 / element.clientHeight);
	// debugger;
	return window.innerHeight / 2 / element.clientHeight;
};

const options = element => {
	return {
		root: null,
		threshold: findThreshold(element),
	};
};

// Create callback function for Intersection Observer
const intersectCallback = entries => {
	entries.forEach(entry => {
		console.log(
			// entry.target,
			// entry.target.clientHeight,
			entry.target.id,
			entry.isIntersecting,
			entry.intersectionRatio
		);
		// debugger;
		const urlHash = `#${entry.target.id}`;
		const ratio = findThreshold(entry.target);
		console.log(ratio);
		const menuAnchor = $(`a[href="${urlHash}"]`);
		console.log(menuAnchor);

		if (entry.isIntersecting && entry.intersectionRatio > ratio) {
			menuAnchor.classList.add('active');
			console.log('BOOSH:', menuAnchor);
			updateHistory(urlHash);
		} else {
			menuAnchor.classList.remove('active');
		}
	});
};

sections.forEach(section => {
	const sectionObserver = new IntersectionObserver(
		intersectCallback,
		options(section)
	);
	sectionObserver.observe(section);
});

// Try to use this for a debounce fn
// const calculateIntersections = () => {
// 	sections.forEach((section) => {
// 		const sectionObserver = new IntersectionObserver(
// 			intersectCallback,
// 			options(section)
// 		);
// 		sectionObserver.observe(section);
// 	});
// };

// Create a boolean that trips when scrollHide is no longer needed
// Evaluated on pageload, and then again later when resizing occurs
const scrollHideToggle = () => (window.innerWidth <= 768 ? true : false);
scrollHideToggle();

const toggleMobileListeners = () => {
	if (scrollHideToggle() === true) {
		window.addEventListener('scroll', scrollHide);
		menuLinks.forEach(el => el.addEventListener('click', toggleMenu));
	} else {
		window.removeEventListener('scroll', scrollHide);
		topNav.classList.remove('scroll-hide');
		[hamburger, menu, socialMenu, body].forEach(el =>
			el.classList.remove('open')
		);
		menuLinks.forEach(el => el.removeEventListener('click', toggleMenu));
	}
};

// Store vertical scroll position for use in scrollHide fn
let previousScrollPosition = window.pageYOffset;

const scrollHide = () => {
	// Store current vertical position to measure against the previous
	const currentScrollPosition = window.pageYOffset;
	const scrollDistance = currentScrollPosition - previousScrollPosition;

	// If the user has not scrolled beyond X pixels of distance, stop here
	if (
		currentScrollPosition < 0 ||
		(scrollDistance < 200 && scrollDistance > -200)
	) {
		return;
	}

	// If user has scrolled beyond X pixels downward, hide nav
	if (scrollDistance >= 200) {
		topNav.classList.add('scroll-hide');
		previousScrollPosition = currentScrollPosition;
	}

	// If user has scrolled beyond X pixels upward, reveal nav
	if (parseFloat(scrollDistance) <= -100) {
		topNav.classList.remove('scroll-hide');
		previousScrollPosition = currentScrollPosition;
	}
};

// Invoke initial functions
toggleMobileListeners();

// Set initial listeners
contactForm.addEventListener('submit', handleSubmit);
// formInputs.forEach(input => input.addEventListener('blur', inputValidate));
fieldsArray.forEach(field => field.input.addEventListener('blur', () => fieldValidate(field)));
// controlGroups.forEach(group =>
// 	group.input.addEventListener('blur', inputValidate)
// );
// formControls.children.forEach(input => input.addEventListener('blur', inputValidate));
window.addEventListener('resize', toggleMobileListeners);
hamburger.addEventListener('click', toggleMenu);

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
	// errorEl: node.children[0].labels[0].querySelector('.input-error'),
	errorUl: node.children[2],
	errors: [],
}));

// Store form inputs for touched status
const formControls = $$('.form-control');

const formInputs = $$('.form-input');

// Store the menu anchors to apply menu close onClick and active link styling
const menuLinks = $$('.menu-anchor');

// toggle the open class for the mobile menu
const toggleMenu = () => {
	let expanded = hamburger.getAttribute('aria-expanded');
	let set = expanded === 'false' ? 'true' : 'false';
	hamburger.setAttribute('aria-expanded', set);

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
	let oldErrorItems = [...field.errorUl.children];
	oldErrorItems.forEach(item => field.errorUl.removeChild(item));

	// Don't really want this at the moment, but might come back to it
	// let oldErrors =
	// 	[...field.errorUl.children].map(child => child.textContent) || [];
	// console.log('OLD ERR', oldErrors);

	// Create document fragment to append error elements to
	let errorFragment = new DocumentFragment();
	field.errors.forEach(err => {
		let errorItem = document.createElement('li');
		errorItem.setAttribute('class', 'field-error');
		errorItem.textContent = err;
		errorFragment.appendChild(errorItem);
	});

	// data-valid="" will be used for onSubmit validation/restriction
	field.input.dataset.valid = false;
	field.errorUl.appendChild(errorFragment); // Append fragment to errorUl, fragment is replaced by it's children
	field.errorUl.classList.add('active');

	if (!field.input.getAttribute('validate-input-listener')) {
		field.input.setAttribute('validate-input-listener', 'true');
		field.input.addEventListener('input', () => fieldValidate(field));
	}
};

// Function to set valid field
const setSuccess = field => {
	// Is this more performant than my logic above that relies on variable assignment?
	[...field.errorUl.children].forEach(child =>
		field.errorUl.removeChild(child)
	);
	// data-valid="" will be used for onSubmit validation/restriction
	field.input.dataset.valid = true;
	field.errorUl.classList.remove('active');

	if (!!field.input.getAttribute('validate-input-listener')) {
		field.input.removeAttribute('validate-input-listener');
	}

	field.input.removeEventListener('input', () => fieldValidate(field));
};

const validateMinMax = (field, min, max) => {
	let length = field.input.value.length;
	let errMsg = `${field.name} must be between ${min} and ${max} characters.`;
	if (length < min || length > max) {
		field.errors = [...field.errors, errMsg];
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

const fieldValidate = field => {
	setTouched(field.input);

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
		setError(field);
	} else {
		setSuccess(field);
	}

	// reset field errors array
	field.errors = [];
};

// Handling contact form submit
const handleSubmit = e => {
	let touchedInputs = [];
	let invalidInputs = [];
	formInputs.forEach(input => {
		if (input.name !== 'last-name') {
			touchedInputs = [...touchedInputs, input.dataset.touched];
			invalidInputs = [...invalidInputs, input.dataset.valid];
		}
	});

	//WOW this is ugly, I need to work on this a bit, but the concept is there...

	if (!touchedInputs.includes('true')) {
		e.preventDefault();
		contactForm.classList.add('invalid');
		contactForm.querySelector('.form-error').innerText =
			'You can not submit an empty form.';
	}

	if (!touchedInputs.includes('true') && !invalidInputs.includes('false')) {
		e.preventDefault();
		contactForm.classList.add('invalid');
		contactForm.querySelector('.form-error').innerText =
			'Quit being weird, how did you do that?';
	}

	if (touchedInputs.includes('true') && invalidInputs.includes('false')) {
		e.preventDefault();
		contactForm.classList.add('invalid');
		contactForm.querySelector('.form-error').innerText =
			'Make sure you fill out the required fields, please :)';
	}

	if (touchedInputs.includes('true') && !invalidInputs.includes('false')) {
		// contactForm.classList.add('invalid');
		// contactForm.querySelector('.form-error').innerText = 'Huzzah';
		return;
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

const findThreshold = element => window.innerHeight / 2 / element.clientHeight;

const options = element => {
	return {
		root: null,
		threshold: findThreshold(element),
	};
};

// Create callback function for Intersection Observer
const intersectCallback = entries => {
	entries.forEach(entry => {
		const urlHash = `#${entry.target.id}`;
		const ratio = findThreshold(entry.target);
		const menuAnchor = $(`a[href="${urlHash}"]`);

		if (entry.isIntersecting && entry.intersectionRatio > ratio) {
			menuAnchor.classList.add('active');
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
		hamburger.setAttribute('aria-expanded', 'false');
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
fieldsArray.forEach(field =>
	field.input.addEventListener('blur', () => fieldValidate(field))
);
window.addEventListener('resize', toggleMobileListeners);
hamburger.addEventListener('click', toggleMenu);

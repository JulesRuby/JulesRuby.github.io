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

// Store form inputs for touched status
const formInputs = $$('.form-input');

// Store the menu anchors to apply menu close onClick and active link styling
const menuLinks = $$('.menu-anchor');

// toggle the open class for the mobile menu
const toggleMenu = () => {
	[hamburger, menu, socialMenu, body].forEach((el) =>
		el.classList.toggle('open')
	);
};

//Function to set input as touched
const setTouched = (event) => (event.target.dataset.touched = 'true');

// function to update the history pushstate, but set a timeout to avoid this being triggered through rapid user scrolling
const updateHistory = (hash) => {
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

const findThreshold = (element) => {
	// console.log(element.id, (window.innerHeight / 2 / element.clientHeight));
	// console.log(element.clientHeight);
	// console.log(window.innerHeight);
	// console.log(window.innerHeight / 2);
	// console.log(window.innerHeight / 2 / element.clientHeight);
	// debugger;
	return window.innerHeight / 2 / element.clientHeight;
};

const options = (element) => {
	return {
		root: null,
		threshold: findThreshold(element),
	};
};

// Create callback function for Intersection Observer
const intersectCallback = (entries) => {
	entries.forEach((entry) => {
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

sections.forEach((section) => {
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
		menuLinks.forEach((el) => el.addEventListener('click', toggleMenu));
	} else {
		window.removeEventListener('scroll', scrollHide);
		topNav.classList.remove('scroll-hide');
		[hamburger, menu, socialMenu, body].forEach((el) =>
			el.classList.remove('open')
		);
		menuLinks.forEach((el) => el.removeEventListener('click', toggleMenu));
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
formInputs.forEach((input) => input.addEventListener('blur', setTouched));
window.addEventListener('resize', toggleMobileListeners);
hamburger.addEventListener('click', toggleMenu);

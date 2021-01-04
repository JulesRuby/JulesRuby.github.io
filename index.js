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

hamburger.addEventListener('click', () => {
	// Toggle open class to each element on hamburger click
	[hamburger, menu, socialMenu, body].forEach((el) =>
		el.classList.toggle('open')
	);
});

// Create a boolean that trips when scrollHide is no longer needed
// Evaluated on pageload, and then again later when resizing occurs
const scrollToggle = () => (window.innerWidth <= 768 ? true : false);
scrollToggle();

// This formatting is cancer, fix linting config later********************
const toggleListener = () => {
	if (scrollToggle() === true) {
		window.addEventListener('scroll', scrollHide);
	} else {
		window.removeEventListener('scroll', scrollHide);
		topNav.classList.remove('scroll-hide');
		[hamburger, menu, socialMenu, body].forEach((el) =>
			el.classList.remove('open')
		);
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

	// If user has scrolled down enough, hide nav
	if (scrollDistance >= 200) {
		topNav.classList.add('scroll-hide');
		previousScrollPosition = currentScrollPosition;
	}

	// If user has scrolled up enough, reveal nav
	if (parseFloat(scrollDistance) <= -200) {
		topNav.classList.remove('scroll-hide');
		previousScrollPosition = currentScrollPosition;
	}
};

toggleListener();

window.addEventListener('resize', toggleListener);

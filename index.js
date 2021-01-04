// Store query selectors to shorten code, basically ape jQuery a bit
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// topNav for making mobile nav hide on scroll
const topNav = $('.navigation');

// Elements for opening and closing mobile menu
// Making use of destructuring to assign nodes to variables
const [hamburger, menu, socialMenu, body] = [
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

// Store vertical scroll position
let previousScrollPosition = window.pageYOffset;
// Store viewport width to conditionally apply scrollHide only on mobile
let previousViewportWidth = window.innerWidth;
// Create a boolean that trips when scrollHide is no longer needed
// Evaluated on pageload, and then again later when resizing occurs
const scrollToggle = () => (window.innerWidth <= 768 ? true : false);
scrollToggle();
// console.log(scrollToggle())

// Create a function to hide the mobile nav on page scroll
// const scrollHide = () => {
// 	window.addEventListener('scroll', () => {
// 		// Store current vertical position to measure against the previous
// 		const currentScrollPosition = window.pageYOffset;
// 		const scrollDistance = currentScrollPosition - previousScrollPosition;

// 		// If the user has not scrolled beyond X pixels of distance, stop here
// 		if (
// 			currentScrollPosition < 0 ||
// 			(scrollDistance < 200 && scrollDistance > -200)
// 		) {
// 			return;
// 		}

// 		// If user has scrolled down enough, hide nav
// 		if (scrollDistance >= 200) {
// 			topNav.classList.add('scroll-hide');
// 			previousScrollPosition = currentScrollPosition;
// 		}

// 		// If user has scrolled up enough, reveal nav
// 		if (parseFloat(scrollDistance) <= -200) {
// 			topNav.classList.remove('scroll-hide');
// 			previousScrollPosition = currentScrollPosition;
// 		}
// 	});
// };

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

// if (scrollSwitch === true) window.addEventListener('scroll', scrollHide);

const toggleListener = () => {
	if (scrollToggle() === true) {
		window.addEventListener('scroll', scrollHide);
	} else {
		window.removeEventListener('scroll', scrollHide);
		topNav.classList.remove('scroll-hide');
	}
};

toggleListener();

// window.addEventListener('resize', () => {
// 	const currentViewportWidth = window.innerWidth;

// 	if (
// 		(previousViewportWidth <= 768 && currentViewportWidth <= 768) ||
// 		(previousViewportWidth > 768 && currentViewportWidth > 768)
// 	) {
// 		return;
// 	} else if (previousViewportWidth <= 768 && currentViewportWidth > 768) {
// 		window.removeEventListener('scroll', scrollHide);
// 		previousViewportWidth = currentViewportWidth;
// 	} else if (previousViewportWidth > 768 && currentViewportWidth <= 768) {
// 		window.addEventListener('scroll', scrollHide);
// 		previousViewportWidth = currentViewportWidth;
// 	}
// });

window.addEventListener('resize', toggleListener);

// if previous width and current width are either:
// both <= 768 or both > 768
// nothing is changed

// but if the previous is either <= or >  than 768
// and current is meets the opposite criteria
// then we trigger the addition/removal of scrollHide event listener

// console.log(viewportWidth);

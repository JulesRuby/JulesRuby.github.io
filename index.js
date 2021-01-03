// Store query selectors to shorten code, basically ape jQuery a bit
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// topNav for making mobile nav hide on scroll
const topNav = $('.navigation');

// Elements for opening and closing mobile menu
// Making use of destructuring to assign nodes to variables
const [hamburger, menu, socialMenu] = [
	$('.menu-button'),
	$('.menu-list'),
	$('.social-list'),
];

hamburger.addEventListener('click', () => {
	// Toggle open class to each elemnt on hamburger interaction
	[hamburger, menu, socialMenu].forEach((el) => el.classList.toggle('open'));
});

// Store vertical scroll position
let previousScrollPosition = window.pageYOffset;

// Create a function to hide the mobile nav on page scroll
const scrollHide = () => {
	window.addEventListener('scroll', () => {
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
	});
};

scrollHide();

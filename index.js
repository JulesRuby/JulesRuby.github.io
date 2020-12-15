// js stuffffff
const hamburger = document.querySelector('.menu-button');
const menu = document.querySelector('.menu-list');

hamburger.addEventListener('click', () => {
	menu.classList.toggle('open');
	hamburger.classList.toggle('open');
})
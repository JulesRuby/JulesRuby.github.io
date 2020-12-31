// js stuffffff
const hamburger = document.querySelector('.menu-button');
const menu = document.querySelector('.menu-list');
const socialMenu = document.querySelector('.social-list');

hamburger.addEventListener('click', () => {
	menu.classList.toggle('open');
	socialMenu.classList.toggle('open');
	hamburger.classList.toggle('open');
})
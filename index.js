/**
 * ArtWeb - Main JavaScript
 * Mobile Navigation Toggle
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');
    const body = document.body;

    // Toggle mobile navigation
    const toggleNav = () => {
        const isOpen = mobileNav.classList.contains('is-open');
        
        if (isOpen) {
            closeNav();
        } else {
            openNav();
        }
    };

    // Open navigation
    const openNav = () => {
        mobileNav.classList.add('is-open');
        burgerMenu.classList.add('is-active');
        burgerMenu.setAttribute('aria-expanded', 'true');
        mobileNav.setAttribute('aria-hidden', 'false');
        body.classList.add('menu-open');
    };

    // Close navigation
    const closeNav = () => {
        mobileNav.classList.remove('is-open');
        burgerMenu.classList.remove('is-active');
        burgerMenu.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        body.classList.remove('menu-open');
    };

    // Event listeners
    burgerMenu.addEventListener('click', toggleNav);

    // Close nav when clicking on nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Close nav when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
            closeNav();
            burgerMenu.focus();
        }
    });

    // Close nav when clicking the Contact Us button in nav
    const navBtn = document.querySelector('.mobile-nav__btn');
    if (navBtn) {
        navBtn.addEventListener('click', closeNav);
    }
});

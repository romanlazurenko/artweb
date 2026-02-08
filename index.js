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

    // ========================================
    // Lightbox / Gallery
    // ========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox?.querySelector('.lightbox__image');
    const lightboxClose = lightbox?.querySelector('.lightbox__close');
    const lightboxPrev = lightbox?.querySelector('.lightbox__nav--prev');
    const lightboxNext = lightbox?.querySelector('.lightbox__nav--next');
    const lightboxCurrent = lightbox?.querySelector('.lightbox__current');
    const lightboxTotal = lightbox?.querySelector('.lightbox__total');
    const lightboxBackdrop = lightbox?.querySelector('.lightbox__backdrop');
    const galleryItems = document.querySelectorAll('.gallery__item');

    let currentIndex = 0;
    const totalImages = galleryItems.length;

    // Update total count
    if (lightboxTotal) {
        lightboxTotal.textContent = totalImages;
    }

    // Open lightbox
    const openLightbox = (index) => {
        if (!lightbox || !galleryItems[index]) return;
        
        currentIndex = index;
        const img = galleryItems[index].querySelector('img');
        
        if (lightboxImage && img) {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
        }
        
        updateCounter();
        updateNavButtons();
        
        lightbox.classList.add('is-active');
        lightbox.setAttribute('aria-hidden', 'false');
        body.classList.add('lightbox-open');
        
        // Focus close button for accessibility
        setTimeout(() => lightboxClose?.focus(), 100);
    };

    // Close lightbox
    const closeLightbox = () => {
        if (!lightbox) return;
        
        lightbox.classList.remove('is-active');
        lightbox.setAttribute('aria-hidden', 'true');
        body.classList.remove('lightbox-open');
        
        // Return focus to the gallery item for accessibility, then blur so it doesn't stay in active state
        const activeItem = galleryItems[currentIndex];
        if (activeItem) {
            activeItem.focus();
            setTimeout(() => activeItem.blur(), 0);
        }
    };

    // Navigate to previous image
    const prevImage = () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateLightboxImage();
        }
    };

    // Navigate to next image
    const nextImage = () => {
        if (currentIndex < totalImages - 1) {
            currentIndex++;
            updateLightboxImage();
        }
    };

    // Update lightbox image with animation
    const updateLightboxImage = () => {
        if (!lightboxImage || !galleryItems[currentIndex]) return;
        
        const img = galleryItems[currentIndex].querySelector('img');
        const content = lightbox.querySelector('.lightbox__content');
        
        // Fade out
        content.style.opacity = '0';
        content.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            updateCounter();
            updateNavButtons();
            
            // Fade in
            content.style.opacity = '1';
            content.style.transform = 'scale(1)';
        }, 150);
    };

    // Update counter display
    const updateCounter = () => {
        if (lightboxCurrent) {
            lightboxCurrent.textContent = currentIndex + 1;
        }
    };

    // Update navigation button states
    const updateNavButtons = () => {
        if (lightboxPrev) {
            lightboxPrev.disabled = currentIndex === 0;
        }
        if (lightboxNext) {
            lightboxNext.disabled = currentIndex === totalImages - 1;
        }
    };

    // Event listeners for gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
    });

    // Lightbox controls
    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxBackdrop?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', prevImage);
    lightboxNext?.addEventListener('click', nextImage);

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox?.classList.contains('is-active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox?.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextImage(); // Swipe left = next
            } else {
                prevImage(); // Swipe right = prev
            }
        }
    };
});

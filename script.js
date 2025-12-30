/**
 * Saguaro Restaurant - Interactive Effects
 *
 * This script handles all interactive effects for the restaurant website:
 * - Parallax effect on hero section
 * - Navigation scroll behavior
 * - Scroll-triggered fade animations
 * - Cursor proximity glow effects on cards
 * - Smooth scroll enhancements
 */

(function() {
    'use strict';

    // ==========================================================================
    // Utility Functions
    // ==========================================================================

    /**
     * Throttle function to limit execution rate
     * Used for scroll and mouse move events to improve performance
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     * Returns true when element is partially visible
     */
    function isInViewport(element, offset = 0.15) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        return rect.top <= windowHeight * (1 - offset) && rect.bottom >= 0;
    }

    // ==========================================================================
    // Hero Parallax Effect
    // ==========================================================================

    /**
     * Subtle parallax movement on hero background image
     * Moves the image slightly based on mouse position for depth effect
     * Effect is disabled on touch devices for better performance
     */
    const heroImage = document.querySelector('.hero-image');
    const heroSection = document.querySelector('.hero');

    if (heroImage && heroSection && !('ontouchstart' in window)) {
        // Track mouse movement over the hero section
        heroSection.addEventListener('mousemove', throttle((e) => {
            const rect = heroSection.getBoundingClientRect();

            // Calculate mouse position relative to section center (-0.5 to 0.5)
            const xPos = (e.clientX - rect.left) / rect.width - 0.5;
            const yPos = (e.clientY - rect.top) / rect.height - 0.5;

            // Apply subtle transform (max 15px movement)
            const moveX = xPos * 15;
            const moveY = yPos * 15;

            heroImage.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        }, 16)); // ~60fps

        // Reset position when mouse leaves
        heroSection.addEventListener('mouseleave', () => {
            heroImage.style.transform = 'translate(0, 0) scale(1.05)';
        });
    }

    // ==========================================================================
    // Navigation Scroll Behavior
    // ==========================================================================

    /**
     * Changes navigation appearance when scrolling past hero section
     * Adds 'scrolled' class for solid background
     */
    const nav = document.querySelector('.nav');

    function updateNavigation() {
        const scrolled = window.scrollY > 100;
        nav.classList.toggle('scrolled', scrolled);
    }

    window.addEventListener('scroll', throttle(updateNavigation, 50));
    updateNavigation(); // Check initial state

    // ==========================================================================
    // Scroll-Triggered Animations
    // ==========================================================================

    /**
     * Fade in elements as they enter the viewport
     * Uses Intersection Observer for performance
     */
    const animatedElements = document.querySelectorAll(
        '.about-content, .about-image, .menu-card, .gallery-item'
    );

    // Create observer with staggered delay for grouped elements
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Calculate stagger delay for grid items
                const parent = entry.target.parentElement;
                const siblings = parent.querySelectorAll('.menu-card, .gallery-item');
                const index = Array.from(siblings).indexOf(entry.target);

                // Apply delay based on position in grid
                const delay = index >= 0 ? index * 100 : 0;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                // Stop observing once animated
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => animationObserver.observe(el));

    // ==========================================================================
    // Cursor Proximity Glow Effect
    // ==========================================================================

    /**
     * Creates a subtle glow effect that follows cursor on menu cards
     * The glow appears near the cursor position within the card
     */
    const menuCards = document.querySelectorAll('.menu-card');

    menuCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();

            // Calculate cursor position as percentage within card
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            // Set CSS custom properties for radial gradient position
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // ==========================================================================
    // Smooth Scroll Enhancement
    // ==========================================================================

    /**
     * Smooth scroll to anchor links with offset for fixed navigation
     * Provides consistent behavior across browsers
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = nav.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================================================
    // Mobile Touch Adaptations
    // ==========================================================================

    /**
     * Adapt hover-dependent interactions for touch devices
     * Menu cards get 'visible' class immediately on touch devices
     */
    if ('ontouchstart' in window) {
        // Make all animated elements visible immediately on touch devices
        // since hover states don't apply the same way
        document.body.classList.add('touch-device');

        // Add tap feedback for cards
        menuCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.classList.add('touched');
            });

            card.addEventListener('touchend', function() {
                setTimeout(() => this.classList.remove('touched'), 150);
            });
        });
    }

    // ==========================================================================
    // Performance: Pause animations when tab is not visible
    // ==========================================================================

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.body.style.setProperty('--transition-smooth', '0s');
            document.body.style.setProperty('--transition-slow', '0s');
        } else {
            document.body.style.setProperty('--transition-smooth', '0.4s cubic-bezier(0.4, 0, 0.2, 1)');
            document.body.style.setProperty('--transition-slow', '0.8s cubic-bezier(0.4, 0, 0.2, 1)');
        }
    });

    // ==========================================================================
    // Initialization Complete
    // ==========================================================================

    console.log('Saguaro restaurant website initialized');

})();

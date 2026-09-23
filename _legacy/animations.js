/**
 * e-Yantra MSIT — Shared Animation System
 * Lightweight scroll reveals, navbar compaction, and stagger utilities.
 * Zero dependencies. Respects prefers-reduced-motion.
 */
(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─── Scroll Reveal via IntersectionObserver ───
    function initScrollReveals() {
        if (prefersReducedMotion) {
            // Immediately show all reveal elements
            document.querySelectorAll('.reveal').forEach(el => {
                el.classList.add('revealed');
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // ─── Navbar Scroll Compaction ───
    function initNavbarScroll() {
        const nav = document.getElementById('main-nav');
        if (!nav) return;

        let ticking = false;
        const scrollThreshold = 80;

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > scrollThreshold) {
                        nav.classList.add('nav-scrolled');
                    } else {
                        nav.classList.remove('nav-scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Check initial state
    }

    // ─── Init ───
    function init() {
        initScrollReveals();
        initNavbarScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

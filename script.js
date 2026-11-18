document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Set Current Year in Footer
       ========================================================================== */
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* ==========================================================================
       Navbar Scroll Effect — rAF-throttled, passive listener
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    let navbarTicking = false;

    window.addEventListener('scroll', () => {
        if (!navbarTicking) {
            requestAnimationFrame(() => {
                if (navbar) {
                    navbar.classList.toggle('scrolled', window.scrollY > 50);
                }
                navbarTicking = false;
            });
            navbarTicking = true;
        }
    }, { passive: true });

    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ==========================================================================
       Scroll Animations (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-stagger');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    /* ==========================================================================
       Intro Animation Sequence
       ========================================================================== */
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
        window.history.replaceState(null, null, window.location.pathname);
    }
    window.scrollTo(0, 0);

    document.body.classList.add('intro-active');
    const lockScroll = () => window.scrollTo(0, 0);
    window.addEventListener('scroll', lockScroll, { passive: true });

    setTimeout(() => {
        const intro = document.getElementById('introScreen');
        if (intro) {
            intro.classList.add('fade-out');
            intro.style.pointerEvents = 'none'; // stop any click capture immediately
            document.body.classList.remove('intro-active');
            window.removeEventListener('scroll', lockScroll);
            window.scrollTo(0, 0);
            setTimeout(() => {
                intro.style.display = 'none';
                // Remove from DOM after display:none to prevent any reflow impact
                requestAnimationFrame(() => intro.remove());
            }, 800);
        }

        // Trigger hero reveal slightly after intro fade starts
        setTimeout(() => {
            window.scrollTo(0, 0);
            const heroReveals = document.querySelectorAll('.hero-content');
            heroReveals.forEach(el => el.classList.add('active'));
        }, 200);
    }, 3200);

    /* ==========================================================================
       Timeline Progress Animation — IntersectionObserver + rAF scroll
       ========================================================================== */
    const timeline = document.querySelector('.process-timeline-horizontal');
    const timelineProgress = document.querySelector('.timeline-connecting-line');

    if (timeline && timelineProgress) {
        let timelineTicking = false;
        let timelineVisible = false;

        const updateTimelineProgress = () => {
            if (!timelineVisible) return;
            const timelineRect = timeline.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const startVal = viewportHeight * 0.8;
            const endVal = viewportHeight * 0.4;
            const diff = startVal - timelineRect.top;
            const total = startVal - endVal;
            const percentage = Math.max(0, Math.min(100, (diff / total) * 100));
            timelineProgress.style.width = `${percentage}%`;
        };

        // Only activate scroll listener when timeline is near the viewport
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                timelineVisible = entry.isIntersecting;
                if (timelineVisible) updateTimelineProgress();
            });
        }, { rootMargin: '200px 0px 200px 0px' });

        timelineObserver.observe(timeline);

        window.addEventListener('scroll', () => {
            if (!timelineTicking && timelineVisible) {
                requestAnimationFrame(() => {
                    updateTimelineProgress();
                    timelineTicking = false;
                });
                timelineTicking = true;
            }
        }, { passive: true });

        // Update on resize (debounced)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateTimelineProgress, 100);
        }, { passive: true });
    }

    /* ==========================================================================
       Google Form Contact Submission
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const sendAnotherBtn = document.getElementById('sendAnotherBtn');
    const confirmPopup = document.getElementById('confirmPopup');
    const confirmPopupClose = document.getElementById('confirmPopupClose');
    const confirmPopupOk = document.getElementById('confirmPopupOk');

    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeoSDWMHYMtErffBOl-z25Mcel4S6LuVkibxf4gyDfYlrTkyQ/formResponse';

    function showConfirmPopup() {
        if (confirmPopup) {
            confirmPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function hideConfirmPopup() {
        if (confirmPopup) {
            confirmPopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const project = document.getElementById('project').value.trim();

            // Disable button and show sending state
            submitBtn.disabled = true;
            const btnText = submitBtn.querySelector('.btn-text');
            if (btnText) btnText.textContent = 'Sending...';

            const formData = new URLSearchParams();
            formData.append('entry.292173717', name);
            formData.append('entry.1570043826', phone);
            formData.append('entry.1188271389', email);
            formData.append('entry.407964985', project);

            try {
                await fetch(GOOGLE_FORM_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString(),
                });
            } catch (err) {
                // no-cors will often land here; the data is still sent
            }

            // Show inline success state
            contactForm.classList.add('submitted');
            contactForm.reset();

            // Reset button text for next use
            submitBtn.disabled = false;
            if (btnText) btnText.textContent = 'Send Request';

            // Show confirmation popup
            showConfirmPopup();
        });
    }

    if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', () => {
            contactForm.classList.remove('submitted');
        });
    }

    // Close popup handlers
    if (confirmPopupClose) {
        confirmPopupClose.addEventListener('click', hideConfirmPopup);
    }
    if (confirmPopupOk) {
        confirmPopupOk.addEventListener('click', hideConfirmPopup);
    }
    if (confirmPopup) {
        confirmPopup.addEventListener('click', (e) => {
            if (e.target === confirmPopup) hideConfirmPopup();
        });
    }
});

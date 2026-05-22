document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Set Current Year in Footer
       ========================================================================== */
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* ==========================================================================
       Navbar Scroll Effect
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Navbar Scrolled Class
        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }


    });

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
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

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
    window.addEventListener('scroll', lockScroll);
    
    setTimeout(() => {
        const intro = document.getElementById('introScreen');
        if (intro) {
            intro.classList.add('fade-out');
            document.body.classList.remove('intro-active');
            window.removeEventListener('scroll', lockScroll);
            window.scrollTo(0, 0);
            setTimeout(() => intro.remove(), 800);
        }
        
        setTimeout(() => {
            window.scrollTo(0, 0);
            const heroReveals = document.querySelectorAll('.hero-content');
            heroReveals.forEach(el => el.classList.add('active'));
        }, 300);
    }, 3200);

    /* ==========================================================================
       Timeline Progress Animation
       ========================================================================== */
    const timeline = document.querySelector('.process-timeline-horizontal');
    const timelineProgress = document.querySelector('.timeline-connecting-line');
    
    if (timeline && timelineProgress) {
        const updateTimelineProgress = () => {
            const timelineRect = timeline.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Starts drawing when the timeline is 80% from top of screen, finishes when it reaches 40%
            const startVal = viewportHeight * 0.8;
            const endVal = viewportHeight * 0.4;
            
            const diff = startVal - timelineRect.top;
            const total = startVal - endVal;
            
            let percentage = (diff / total) * 100;
            percentage = Math.max(0, Math.min(100, percentage));
            
            timelineProgress.style.width = `${percentage}%`;
        };
        
        window.addEventListener('scroll', updateTimelineProgress);
        window.addEventListener('resize', updateTimelineProgress);
        updateTimelineProgress(); // Initial call
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

    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScaaUc5gvXhNN0w1U8_xbjABgKB0ijGt2qDWSESqabeUfR0xQ/formResponse';

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
            formData.append('entry.597638784', name);
            formData.append('entry.835609725', phone);
            formData.append('entry.381264150', email);
            formData.append('entry.1703191043', project);

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

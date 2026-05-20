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
            setTimeout(() => intro.remove(), 1200);
        }
        
        setTimeout(() => {
            window.scrollTo(0, 0);
            const heroReveals = document.querySelectorAll('.hero-content');
            heroReveals.forEach(el => el.classList.add('active'));
        }, 400);
    }, 3800);

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
});

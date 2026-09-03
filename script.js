// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. HERO TYPOGRAPHY REVEAL (THE IMPACT & CRACK) ---
    const heroTitle = document.getElementById('heroTitle');
    const text = heroTitle.innerText;
    heroTitle.innerHTML = ''; 
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.className = 'char';
        span.innerText = char;
        heroTitle.appendChild(span);
    });

    const chars = document.querySelectorAll('.hero-title .char');
    const heroTl = gsap.timeline();

    // 1. Fast Quiet beginning
    heroTl.to('.hero-pre-title', { opacity: 1, duration: 0.5, ease: "power2.out" });

    // 2. The Heavy Drop (Whole word together)
    gsap.set(chars, { margin: "0 10px" });
    heroTl.fromTo(chars, 
        { y: -100, opacity: 0, scaleY: 1.2 },
        { 
            y: 0, 
            opacity: 1, 
            scaleY: 1, 
            duration: 0.8, 
            ease: "expo.out"
        },
        "-=0.2" // Starts almost immediately after pre-title
    );

    if (!prefersReducedMotion) {
        // Subtle impact squash (Whole word together)
        heroTl.to(chars, {
            scaleY: 0.9,
            scaleX: 1.05,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        }, "-=0.8"); 

        // 3. Screen Shake & Crack
        heroTl.to('.hero-content', {
            y: 5,
            duration: 0.05,
            yoyo: true,
            repeat: 2,
            ease: "none"
        }, "-=1.0");
    }

    // Tracking tightens and settles
    heroTl.to(chars, {
        margin: "0 0px",
        duration: 1.2,
        ease: "power3.inOut"
    }, "-=0.2");

    if (!prefersReducedMotion) {
        // Elegant crack draws itself outward
        heroTl.to('.crack-path', {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.1
        }, "-=1.0");
    } else {
        gsap.set('.crack-path', { strokeDashoffset: 0 });
    }

    // 4. Reveal Content from behind the crack
    const maskElements = document.querySelectorAll('.hero-reveal-mask > *');
    heroTl.fromTo(maskElements, {
        y: prefersReducedMotion ? 0 : -60, 
        opacity: 0
    }, {
        y: 0, 
        opacity: 1, 
        duration: 1.2, 
        stagger: prefersReducedMotion ? 0 : 0.2, 
        ease: "power4.out"
    }, prefersReducedMotion ? "-=0" : "-=0.8");


    // --- Subtle Parallax on Hero Title after reveal ---
    if (!prefersReducedMotion) {
        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            gsap.to('.hero-title', { rotationY: xAxis, rotationX: yAxis, ease: "power1.out", duration: 1 });
        });
    }


    // --- 2. DYNAMIC TEXT SWAPPER ---
    const dynamicWords = document.querySelectorAll('.dynamic-word');
    let currentIndex = 0;
    function swapText() {
        if(dynamicWords.length === 0) return;
        const currentWord = dynamicWords[currentIndex];
        currentIndex = (currentIndex + 1) % dynamicWords.length;
        const nextWord = dynamicWords[currentIndex];
        
        if (!prefersReducedMotion) {
            gsap.to(currentWord, {
                y: -30, opacity: 0, duration: 0.6, ease: "power3.inOut",
                onComplete: () => { currentWord.classList.remove('active'); gsap.set(currentWord, { y: 30 }); }
            });
            nextWord.classList.add('active');
            gsap.fromTo(nextWord, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.inOut" });
        } else {
            currentWord.classList.remove('active');
            nextWord.classList.add('active');
        }
    }
    setTimeout(() => { setInterval(swapText, 3000); }, 3000);


    // --- 3. CINEMATIC SCROLL TRANSITION ---
    const cinematicWords = document.querySelectorAll('.cinematic-text .word');
    if (!prefersReducedMotion) {
        ScrollTrigger.create({
            trigger: ".cinematic-transition",
            start: "top top",
            end: "+=150%", 
            pin: true,
            scrub: true
        });
        gsap.to(cinematicWords, {
            color: "#181713",
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
                trigger: ".cinematic-transition",
                start: "top center",
                end: "bottom bottom",
                scrub: 0.5
            }
        });
    } else {
        gsap.set(cinematicWords, { color: "#181713" });
    }


    // --- 4. MAGNETIC CTA ---
    if (!prefersReducedMotion) {
        const magneticBtns = document.querySelectorAll('.magnetic');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: "power2.out" });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
            });
        });
    }


    // --- 5. CAPABILITY SHOWCASES (MOCKUPS & PARALLAX) ---
    const showcases = document.querySelectorAll('.showcase-chapter');
    showcases.forEach(showcase => {
        const visual = showcase.querySelector('.showcase-visual');
        const mockup = showcase.querySelector('.large-mockup');
        const animElements = showcase.querySelectorAll('.anim-element');

        if (!prefersReducedMotion) {
            // Parallax effect on the entire visual container
            gsap.to(visual, {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: showcase,
                    start: "top bottom", 
                    end: "bottom top",
                    scrub: true
                }
            });

            // 3D Assembly effect on the mockup itself
            gsap.from(mockup, {
                scrollTrigger: { trigger: showcase, start: "top 70%" },
                y: 100, 
                rotationX: 10, 
                scale: 0.95,
                opacity: 0, 
                duration: 1.2, 
                ease: "power3.out"
            });

            // Staggered assembly of interior UI elements
            if(animElements.length > 0) {
                gsap.from(animElements, {
                    scrollTrigger: { trigger: showcase, start: "top 60%" },
                    y: 20, 
                    opacity: 0, 
                    duration: 0.8, 
                    stagger: 0.1, 
                    delay: 0.2,
                    ease: "back.out(1.2)"
                });
            }
        } else {
            gsap.set([mockup, animElements], { opacity: 1, y: 0, scale: 1, rotationX: 0 });
        }
    });


    // --- 6. PRICING REVEAL ---
    if (!prefersReducedMotion) {
        gsap.from(".price-row", {
            scrollTrigger: { trigger: ".pricing-section", start: "top 70%" },
            y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
        });
    }


    // --- 7. FINAL CTA SEQUENCE ---
    if (!prefersReducedMotion) {
        const ctaTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".final-cta",
                start: "top center",
                end: "bottom bottom",
                scrub: true,
                onEnter: () => {
                    document.querySelector('.main-nav').classList.add('nav-inverted');
                    document.querySelectorAll('.pre-line, .step-final, .huge-cta, .cta-email').forEach(el => el.classList.add('text-ivory'));
                },
                onLeaveBack: () => {
                    document.querySelector('.main-nav').classList.remove('nav-inverted');
                    document.querySelectorAll('.pre-line, .step-final, .huge-cta, .cta-email').forEach(el => el.classList.remove('text-ivory'));
                }
            }
        });

        const preLines = document.querySelectorAll('.pre-line');

        ctaTl.to('.step-pre', { opacity: 1, duration: 0.1 })
             .fromTo(preLines, 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1, stagger: 0.5 }
             )
             .to('.step-pre', { y: -40, opacity: 0, duration: 1, delay: 1 })
             .to(".final-cta", { backgroundColor: "#24372D", duration: 1 }, "-=0.5")
             .to(".step-final", { y: 0, opacity: 1, duration: 1 })
             .to(".cta-final-action", { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
    } else {
        gsap.set('.final-cta', { backgroundColor: "#24372D" });
        gsap.set(['.step-final', '.cta-final-action'], { opacity: 1, y: 0 });
        gsap.set('.step-pre', { display: 'none' });
        document.querySelectorAll('.step-final, .huge-cta, .cta-email').forEach(el => el.classList.add('text-ivory'));
    }

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'var(--ivory)';
            navLinks.style.padding = '2rem';
        });
    } // <-- SYNTAX ERROR FIXED

    // Floating Controls Entrance
    setTimeout(() => {
        const floaters = document.querySelector('.floating-controls');
        if (floaters) floaters.classList.add('visible');
    }, 2500);

});

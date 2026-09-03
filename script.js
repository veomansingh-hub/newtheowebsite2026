// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. HERO TYPOGRAPHY REVEAL ---
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
    gsap.fromTo(chars, 
        { y: 100, opacity: 0, scaleY: 1.5, rotationX: -45 },
        { y: 0, opacity: 1, scaleY: 1, rotationX: 0, duration: 1.2, stagger: 0.05, ease: "power4.out", delay: 0.2 }
    );
    gsap.fromTo(['.hero-support', '.hero-ctas'],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 1.5 }
    );


    // --- 2. DYNAMIC TEXT SWAPPER ---
    const dynamicWords = document.querySelectorAll('.dynamic-word');
    let currentIndex = 0;
    function swapText() {
        const currentWord = dynamicWords[currentIndex];
        currentIndex = (currentIndex + 1) % dynamicWords.length;
        const nextWord = dynamicWords[currentIndex];
        gsap.to(currentWord, {
            y: -30, opacity: 0, duration: 0.6, ease: "power3.inOut",
            onComplete: () => { currentWord.classList.remove('active'); gsap.set(currentWord, { y: 30 }); }
        });
        nextWord.classList.add('active');
        gsap.fromTo(nextWord, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.inOut" });
    }
    setTimeout(() => { setInterval(swapText, 3000); }, 2000);


    // --- 3. CINEMATIC SCROLL TRANSITION ---
    const cinematicWords = document.querySelectorAll('.cinematic-text .word');
    ScrollTrigger.create({
        trigger: ".cinematic-transition",
        start: "top top",
        end: "+=100%", 
        pin: true,
        scrub: true
    });
    // Color transitions from muted beige to charcoal
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


    // --- 4. MAGNETIC CTA ---
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


    // --- 5. PHASE 2: SERVICES UI ASSEMBLY ---
    
    // Website Browser Mockup Assembly
    gsap.from(".mockup-browser", {
        scrollTrigger: { trigger: ".chapter-websites", start: "top 60%" },
        y: 100, rotationX: 20, opacity: 0, duration: 1, ease: "power3.out"
    });
    gsap.from(".wireframe-hero, .wireframe-text-block, .w-card", {
        scrollTrigger: { trigger: ".chapter-websites", start: "top 60%" },
        y: 30, opacity: 0, duration: 0.8, stagger: 0.2, delay: 0.3, ease: "power2.out"
    });

    // POS Mockup Assembly
    gsap.from(".mockup-pos", {
        scrollTrigger: { trigger: ".chapter-pos", start: "top 60%" },
        x: 100, opacity: 0, duration: 1, ease: "power3.out"
    });
    gsap.from(".pos-table", {
        scrollTrigger: { trigger: ".chapter-pos", start: "top 50%" },
        scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)"
    });

    // Dashboard Mockup Assembly
    gsap.from(".mockup-dashboard", {
        scrollTrigger: { trigger: ".chapter-software", start: "top 60%" },
        y: 50, scale: 0.9, opacity: 0, duration: 1, ease: "power3.out"
    });
    gsap.from(".dash-panel", {
        scrollTrigger: { trigger: ".chapter-software", start: "top 50%" },
        y: 40, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power2.out"
    });


    // --- 6. PHASE 2: SELECTED WORK PARALLAX ---
    const projects = document.querySelectorAll('.project-chapter');
    projects.forEach(proj => {
        const visual = proj.querySelector('.project-visual');
        gsap.to(visual, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: proj,
                start: "top bottom", 
                end: "bottom top",
                scrub: true
            }
        });
    });


    // --- 7. PHASE 2: PRICING REVEAL ---
    gsap.from(".price-row", {
        scrollTrigger: { trigger: ".pricing-section", start: "top 70%" },
        y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
    });


    // --- 8. PHASE 2: FINAL CTA SEQUENCE ---
    const ctaTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".final-cta",
            start: "top center",
            end: "bottom bottom",
            scrub: true,
            onEnter: () => {
                document.querySelector('.main-nav').classList.add('nav-inverted');
                document.querySelectorAll('.cta-step, .huge-cta, .cta-email').forEach(el => el.classList.add('text-ivory'));
            },
            onLeaveBack: () => {
                document.querySelector('.main-nav').classList.remove('nav-inverted');
                document.querySelectorAll('.cta-step, .huge-cta, .cta-email').forEach(el => el.classList.remove('text-ivory'));
            }
        }
    });

    // Change background to Forest Green for a strong ending
    ctaTl.to(".final-cta", { backgroundColor: "#24372D", duration: 0.5 })
         .to(".step-1", { y: 0, opacity: 1, duration: 1 })
         .to(".step-1", { y: -40, opacity: 0, duration: 1, delay: 1 })
         .to(".step-2", { y: 0, opacity: 1, duration: 1 })
         .to(".cta-final-action", { opacity: 1, y: 0, duration: 1, ease: "power2.out" });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if(mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'var(--ivory)';
            // Keep text dark in mobile menu unless inverted
            navLinks.style.padding = '2rem';
        });
    }
});

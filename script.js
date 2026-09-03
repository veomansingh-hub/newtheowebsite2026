gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- 1. SMOOTH SCROLL (LENIS) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0, 0);


    // --- 2. HERO REVEAL ---
    const heroTitle = document.getElementById("heroTitle");
    const text = heroTitle.innerText;
    heroTitle.innerHTML = ""; 
    text.split("").forEach(char => {
        const span = document.createElement("span");
        span.className = "char";
        span.innerText = char;
        heroTitle.appendChild(span);
    });

    const chars = document.querySelectorAll(".hero-title .char");
    const heroTl = gsap.timeline();

    gsap.set(chars, { margin: "0 10px" });
    
    // One unified heavy drop
    heroTl.fromTo(chars, 
        { y: -100, opacity: 0, scaleY: 1.1 },
        { y: 0, opacity: 1, scaleY: 1, duration: 0.6, ease: "expo.out" }
    );

    if (!prefersReducedMotion) {
        heroTl.to(chars, { scaleY: 0.95, scaleX: 1.02, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.inOut" }, "-=0.1"); 
        heroTl.to(".hero-content", { y: 2, duration: 0.05, yoyo: true, repeat: 1, ease: "none" }, "-=0.1");
    }

    heroTl.to(chars, { margin: "0 0px", duration: 1, ease: "power3.inOut" }, "-=0.1");

    if (!prefersReducedMotion) {
        heroTl.to(".crack-path", { strokeDashoffset: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }, "-=0.8");
        // Expand the horizontal divider
        heroTl.to(".divider-line", { opacity: 1, attr: { x1: 0, x2: 1000 }, duration: 1, ease: "power3.inOut" }, "-=0.4");
    } else {
        gsap.set(".crack-path", { strokeDashoffset: 0 });
        gsap.set(".divider-line", { opacity: 1, attr: { x1: 0, x2: 1000 }});
    }

    const maskElements = document.querySelectorAll(".hero-reveal-mask > *");
    heroTl.fromTo(maskElements, 
        { y: prefersReducedMotion ? 0 : -40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out" }, 
        "-=0.6"
    );

    // Dynamic Text Swapper
    const dynamicWords = document.querySelectorAll(".dynamic-word");
    let currentIndex = 0;
    function swapText() {
        if(dynamicWords.length === 0) return;
        const currentWord = dynamicWords[currentIndex];
        currentIndex = (currentIndex + 1) % dynamicWords.length;
        const nextWord = dynamicWords[currentIndex];
        
        if (!prefersReducedMotion) {
            gsap.to(currentWord, { y: -20, opacity: 0, duration: 0.5, onComplete: () => { currentWord.classList.remove("active"); gsap.set(currentWord, { y: 20 }); }});
            nextWord.classList.add("active");
            gsap.fromTo(nextWord, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
        } else {
            currentWord.classList.remove("active"); nextWord.classList.add("active");
        }
    }
    setTimeout(() => { setInterval(swapText, 2500); }, 2500);


    // --- 3. NARRATIVE TRACK (Manifesto & Line) ---
    if (!prefersReducedMotion) {
        gsap.to(".continuous-line", {
            height: "100%",
            ease: "none",
            scrollTrigger: { trigger: ".narrative-track", start: "top center", end: "bottom center", scrub: true }
        });
        
        const mTl = gsap.timeline({ scrollTrigger: { trigger: ".manifesto-container", start: "top 70%", end: "bottom 30%", scrub: true }});
        mTl.from(".cinematic-text .line", { y: 40, opacity: 0, stagger: 0.1 })
           .from(".m-built", { y: 40, opacity: 0 }, "+=0.2")
           .from(".m-around", { y: 40, opacity: 0 }, "+=0.2");
    } else {
        gsap.set([".cinematic-text .line", ".m-built", ".m-around"], { opacity: 1, y: 0 });
        gsap.set(".continuous-line", { height: "100%" });
    }


    // --- 4. UNIFIED MORPHING STAGE ---
    if (!prefersReducedMotion && window.innerWidth > 1024) {
        
        const morphTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".unified-services",
                start: "top top",
                end: "+=300%",
                pin: true,
                scrub: 1,
            }
        });

        // Initial States
        gsap.set(".st-1", { opacity: 1, y: 0, pointerEvents: "auto" });
        gsap.set([".st-2", ".st-3"], { opacity: 0, y: 50 });
        
        gsap.set(".ui-sidebar", { width: 0, opacity: 0 }); 
        gsap.set(".ui-main", { left: 0, width: "100%", height: "calc(100% - 40px)", top: 40 });
        
        gsap.set(".ui-web-title", { opacity: 1 });
        gsap.set(".ui-web-links", { opacity: 1, y: 0, pointerEvents: "auto" });
        gsap.set(".web-state", { opacity: 1, pointerEvents: "auto" });
        
        // STAGE 1 -> STAGE 2 (Websites to POS)
        morphTl
            .to(".st-1", { opacity: 0, y: -50, duration: 1 })
            .to(".st-2", { opacity: 1, y: 0, pointerEvents: "auto", duration: 1 }, "-=0.5")
            
            .to(".ui-web-title", { opacity: 0, duration: 0.3 }, "-=1")
            .to(".ui-pos-title", { opacity: 1, duration: 0.3 }, "-=0.7")
            .to(".ui-header", { backgroundColor: "#E9E1D2", duration: 1 }, "-=1")
            
            .to(".ui-sidebar", { width: 80, opacity: 1, duration: 1 }, "-=1")
            .to(".ui-main", { left: 80, width: "calc(100% - 80px)", duration: 1 }, "-=1")
            
            .to(".web-state", { opacity: 0, pointerEvents: "none", scale: 0.95, duration: 0.5 }, "-=1")
            .to(".pos-state", { opacity: 1, pointerEvents: "auto", scale: 1, duration: 0.5 }, "-=0.5")
            .to(".ui-web-links", { opacity: 0, duration: 0.3 }, "-=1")
            .to(".ui-pos-links", { opacity: 1, pointerEvents: "auto", duration: 0.5 }, "-=0.5")
            
            .addPause(0) 

        // STAGE 2 -> STAGE 3 (POS to Dashboard)
        morphTl
            .to(".st-2", { opacity: 0, y: -50, pointerEvents: "none", duration: 1 })
            .to(".st-3", { opacity: 1, y: 0, pointerEvents: "auto", duration: 1 }, "-=0.5")
            
            .to(".ui-pos-title", { opacity: 0, duration: 0.3 }, "-=1")
            .to(".ui-dash-title", { opacity: 1, duration: 0.3 }, "-=0.7")
            .to(".ui-header-user", { opacity: 1, duration: 0.5 }, "-=1")
            .to(".ui-header", { backgroundColor: "#F3EFE5", duration: 1 }, "-=1")
            
            .to(".ui-sidebar", { backgroundColor: "#24372D", width: 70, duration: 1 }, "-=1")
            .to(".ui-main", { left: 70, width: "calc(100% - 70px)", duration: 1 }, "-=1")
            
            .to(".pos-state", { opacity: 0, pointerEvents: "none", scale: 0.95, duration: 0.5 }, "-=1")
            .to(".dash-state", { opacity: 1, pointerEvents: "auto", scale: 1, duration: 0.5 }, "-=0.5")
            .to(".ui-pos-links", { opacity: 0, pointerEvents: "none", duration: 0.3 }, "-=1")
            .to(".ui-dash-links", { opacity: 1, pointerEvents: "auto", duration: 0.5 }, "-=0.5");
            
    } else {
        // Fallback for mobile and reduced motion is just normal scrolling, no pinning.
        gsap.set([".st-1", ".st-2", ".st-3"], { opacity: 1, y: 0, pointerEvents: "auto" });
        // The HTML structure on mobile puts the canvas sticky at the top, and text blocks scroll over it.
        // For simplicity, we just leave it in the default state on reduced motion/mobile, or we could set up 
        // a simplified ScrollTrigger that just fades the UI states based on which text block is active.
        if (window.innerWidth <= 1024) {
            const mobileUiTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".unified-services",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1
                }
            });
            mobileUiTl.to(".web-state", { opacity: 0, duration: 1 })
                      .to(".pos-state", { opacity: 1, duration: 1 }, "-=0.5")
                      .to(".pos-state", { opacity: 0, duration: 1 })
                      .to(".dash-state", { opacity: 1, duration: 1 }, "-=0.5");
        }
    }


    // --- 5. FINAL CTA (INK FILL) ---
    if (!prefersReducedMotion) {
        const ctaTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".final-cta",
                start: "top center",
                end: "bottom bottom",
                scrub: true,
                onEnter: () => document.querySelector(".main-nav").classList.add("nav-inverted"),
                onLeaveBack: () => document.querySelector(".main-nav").classList.remove("nav-inverted")
            }
        });

        ctaTl.to(".ink-mask", { scale: 350, duration: 1.5, ease: "power2.in" })
             .to(".step-pre", { opacity: 0, y: -20, duration: 0.5 }, "-=1.0")
             .to(".step-final", { opacity: 1, y: 0, duration: 0.5 }, "-=0.5")
             .to(".cta-final-action", { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
    } else {
        gsap.set(".final-cta", { backgroundColor: "#24372D" });
        gsap.set([".step-final", ".cta-final-action"], { opacity: 1, y: 0 });
        gsap.set(".step-pre", { display: "none" });
    }

    // Nav mobile toggle
    const mobileToggle = document.querySelector(".mobile-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener("click", () => {
            if (navLinks.style.display === "flex") {
                navLinks.style.display = "none";
            } else {
                navLinks.style.display = "flex";
                navLinks.style.flexDirection = "column";
                navLinks.style.position = "absolute";
                navLinks.style.top = "100%";
                navLinks.style.left = "0";
                navLinks.style.width = "100%";
                navLinks.style.background = "var(--ivory)";
                navLinks.style.padding = "2rem";
            }
        });
    }

});

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- 1. SMOOTH SCROLL (LENIS) ---
    // Fix: Only use GSAP ticker for Lenis RAF to avoid double loop
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
    });

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
    
    // Snappier unified heavy drop
    heroTl.fromTo(chars, 
        { y: -80, opacity: 0, scaleY: 1.05 },
        { y: 0, opacity: 1, scaleY: 1, duration: 0.5, ease: "expo.out" }
    );

    if (!prefersReducedMotion) {
        heroTl.to(chars, { scaleY: 0.97, scaleX: 1.01, duration: 0.08, yoyo: true, repeat: 1, ease: "power2.inOut" }, "-=0.05"); 
        heroTl.to(".hero-content", { y: 2, duration: 0.05, yoyo: true, repeat: 1, ease: "none" }, "-=0.05");
    }

    heroTl.to(chars, { margin: "0 0px", duration: 0.8, ease: "power3.inOut" }, "-=0.05");

    if (!prefersReducedMotion) {
        heroTl.to(".crack-path", { strokeDashoffset: 0, duration: 0.6, ease: "power3.out", stagger: 0.05 }, "-=0.6");
        heroTl.to(".divider-line", { opacity: 1, attr: { x1: 0, x2: 1000 }, duration: 0.8, ease: "power3.inOut" }, "-=0.3");
    } else {
        gsap.set(".crack-path", { strokeDashoffset: 0 });
        gsap.set(".divider-line", { opacity: 1, attr: { x1: 0, x2: 1000 }});
    }

    const maskElements = document.querySelectorAll(".hero-reveal-mask > *");
    heroTl.fromTo(maskElements, 
        { y: prefersReducedMotion ? 0 : -30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "power4.out" }, 
        "-=0.5"
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
        mTl.from(".cinematic-text .line", { y: 30, opacity: 0, stagger: 0.1 })
           .from(".m-built", { y: 30, opacity: 0 }, "+=0.15")
           .from(".m-around", { y: 30, opacity: 0 }, "+=0.15");
    } else {
        gsap.set([".cinematic-text .line", ".m-built", ".m-around"], { opacity: 1, y: 0 });
        gsap.set(".continuous-line", { height: "100%" });
    }


    // --- 4. UNIFIED MORPHING STAGE (Desktop & Mobile) ---
    if (!prefersReducedMotion) {
        
        // --- DESKTOP MORPHING ---
        if (window.innerWidth > 1024) {
            const morphTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".desktop-services",
                    start: "top top",
                    end: "+=260%", // Dialed in perfectly
                    pin: true,
                    scrub: 0.8 // slight lag for buttery feel
                }
            });

            // Initial text states
            gsap.set(".st-1", { opacity: 1, y: 0, filter: "blur(0px)" });
            gsap.set([".st-2", ".st-3"], { opacity: 0, y: 30, filter: "blur(4px)" });
            
            // Initial UI states
            gsap.set(".u-side-icons", { opacity: 0 });
            gsap.set([".u-main-pos", ".u-main-dash", ".up-pos", ".up-dash"], { display: "none", opacity: 0 });
            
            // TRANSITION 1 (Web -> POS)
            morphTl
                // TEXT 1 OUT (Clean exit before Text 2)
                .to(".st-1", { opacity: 0, y: -40, filter: "blur(4px)", duration: 0.6 })
                
                // UI MORPH 1
                .to(".u-nav-links", { opacity: 0, duration: 0.2 }, "-=0.6")
                .to(".u-pos-time", { display: "block", opacity: 1, duration: 0.2 }, "-=0.4")
                .to(".u-head-btn", { opacity: 0, duration: 0.2 }, "-=0.6")
                .to(".u-head-user", { display: "block", opacity: 1, duration: 0.3 }, "-=0.4")
                
                .to(".u-transformer", { width: "80px", height: "100%", top: "60px", zIndex: 11, duration: 0.8, ease: "power3.inOut" }, "-=0.6")
                .to(".u-hero-img", { opacity: 0, duration: 0.2 }, "-=0.8")
                .to(".u-side-icons", { display: "flex", opacity: 1, duration: 0.4 }, "-=0.2")
                
                .to(".u-main-web", { opacity: 0, y: -20, duration: 0.3 }, "-=0.6")
                .set(".u-main-web", { display: "none" }, "-=0.3")
                .set(".u-main", { left: "80px", width: "calc(100% - 80px)", height: "calc(100% - 60px)" }, "-=0.3")
                .set(".u-main-pos", { display: "flex" }, "-=0.3")
                .fromTo(".u-main-pos", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3")
                
                .to(".u-panel", { width: "240px", height: "calc(100% - 60px)", borderTop: "none", duration: 0.8, ease: "power3.inOut" }, "-=0.8")
                .to(".up-web", { opacity: 0, duration: 0.2 }, "-=0.8")
                .set(".up-web", { display: "none" }, "-=0.6")
                .set(".up-pos", { display: "flex" }, "-=0.6")
                .fromTo(".up-pos", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.4")

                // TEXT 2 IN (Starts only after UI has morphed and Text 1 is gone)
                .to(".st-2", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 })
                
                // Pause for reading
                .addPause(0) // wait, I shouldn't use addPause! User says NO PAUSE.
                // Replaced pause with empty spacer
                .to({}, { duration: 0.2 })

            // TRANSITION 2 (POS -> Dash)
            morphTl
                // TEXT 2 OUT
                .to(".st-2", { opacity: 0, y: -40, filter: "blur(4px)", duration: 0.6 })
                
                // UI MORPH 2
                .to(".u-header", { backgroundColor: "#F3EFE5", duration: 0.6 }, "-=0.6")
                .to(".u-transformer", { backgroundColor: "#24372D", width: "70px", duration: 0.6 }, "-=0.6")
                .to(".si", { borderColor: "rgba(255,255,255,0.2)", duration: 0.3 }, "-=0.6")
                .to(".si.active", { backgroundColor: "#344536", borderColor: "#72745A", duration: 0.3 }, "-=0.6")
                
                .to(".u-main-pos", { opacity: 0, y: -20, duration: 0.3 }, "-=0.6")
                .set(".u-main-pos", { display: "none" }, "-=0.3")
                .set(".u-main", { left: "70px", width: "calc(100% - 70px)" }, "-=0.3")
                .set(".u-main-dash", { display: "flex" }, "-=0.3")
                .fromTo(".u-main-dash", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3")
                
                .to(".u-panel", { width: "260px", backgroundColor: "white", duration: 0.6 }, "-=0.6")
                .to(".up-pos", { opacity: 0, duration: 0.2 }, "-=0.6")
                .set(".up-pos", { display: "none" }, "-=0.4")
                .set(".up-dash", { display: "flex" }, "-=0.4")
                .fromTo(".up-dash", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.4")
                
                // CHART ANIMATION INSIDE DASH
                .fromTo(".umdc-bar", { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, stagger: 0.05, duration: 0.4 }, "-=0.2")

                // TEXT 3 IN
                .to(".st-3", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 }, "-=0.2");
        } 
        // --- MOBILE ANIMATIONS (Internal triggers per stage) ---
        else {
            gsap.utils.toArray(".m-stage").forEach(stage => {
                gsap.fromTo(stage.querySelector(".m-text"), 
                    { opacity: 0, y: 30 }, 
                    { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: stage, start: "top 75%" } }
                );
                gsap.fromTo(stage.querySelector(".m-visual"),
                    { opacity: 0, scale: 0.95, y: 40 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.8, delay: 0.1, scrollTrigger: { trigger: stage, start: "top 75%" } }
                );
            });
            
            // POS Mobile Inner Animation
            gsap.fromTo(".m-t", { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.1, scrollTrigger: { trigger: ".m-pos", start: "top 50%" }});
            // Dash Mobile Inner Animation
            gsap.fromTo(".m-b", { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, stagger: 0.1, scrollTrigger: { trigger: ".m-dash", start: "top 50%" }});
        }
    } else {
        // Reduced Motion
        gsap.set(".desktop-services", { display: "none" });
        gsap.set(".mobile-services", { display: "block" });
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

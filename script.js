// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. HERO TYPOGRAPHY REVEAL ---
    const heroTitle = document.getElementById('heroTitle');
    const text = heroTitle.innerText;
    heroTitle.innerHTML = ''; // Clear existing text

    // Wrap each character in a span
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.className = 'char';
        span.innerText = char;
        heroTitle.appendChild(span);
    });

    const chars = document.querySelectorAll('.hero-title .char');
    
    // Premium reveal animation (letters start separated and slide/stretch into place)
    gsap.fromTo(chars, 
        { 
            y: 100, 
            opacity: 0, 
            scaleY: 1.5, // The 'stretch' effect
            rotationX: -45
        },
        {
            y: 0,
            opacity: 1,
            scaleY: 1,
            rotationX: 0,
            duration: 1.2,
            stagger: 0.05,
            ease: "power4.out",
            delay: 0.2
        }
    );

    // Fade in support text and CTAs
    gsap.fromTo(['.hero-support', '.hero-ctas'],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 1.5 }
    );


    // --- 2. DYNAMIC TEXT SWAPPER ---
    const dynamicWords = document.querySelectorAll('.dynamic-word');
    let currentIndex = 0;

    function swapText() {
        const currentWord = dynamicWords[currentIndex];
        
        // Next index
        currentIndex = (currentIndex + 1) % dynamicWords.length;
        const nextWord = dynamicWords[currentIndex];

        // Animate current out (up and fade)
        gsap.to(currentWord, {
            y: -30,
            opacity: 0,
            duration: 0.6,
            ease: "power3.inOut",
            onComplete: () => {
                currentWord.classList.remove('active');
                gsap.set(currentWord, { y: 30 }); // Reset position for next time
            }
        });

        // Animate next in (from bottom and fade)
        nextWord.classList.add('active');
        gsap.fromTo(nextWord, 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.inOut" }
        );
    }

    // Start loop after initial reveal
    setTimeout(() => {
        setInterval(swapText, 3000);
    }, 2000);


    // --- 3. CINEMATIC SCROLL TRANSITION ---
    // Light up words as you scroll
    const cinematicWords = document.querySelectorAll('.cinematic-text .word');
    
    // Optional: pin the transition section for a moment
    ScrollTrigger.create({
        trigger: ".cinematic-transition",
        start: "top top",
        end: "+=100%", 
        pin: true,
        scrub: true
    });

    // Illuminate words sequentially
    gsap.to(cinematicWords, {
        color: "#F3F1EB", // Full brightness
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
            trigger: ".cinematic-transition",
            start: "top center", // Start lighting up when section is halfway up the viewport
            end: "bottom bottom", // Finish when section ends
            scrub: 0.5 // Smooth scrubbing
        }
    });

    // --- 4. MAGNETIC CTA (Subtle mouse-reactive movement) ---
    const magneticBtn = document.querySelector('.magnetic');
    
    if (magneticBtn) {
        magneticBtn.addEventListener('mousemove', (e) => {
            const rect = magneticBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move button slightly
            gsap.to(magneticBtn, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        magneticBtn.addEventListener('mouseleave', () => {
            // Reset position
            gsap.to(magneticBtn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    }
});

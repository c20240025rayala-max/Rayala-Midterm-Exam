
"use strict";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);


// ========================================
// B1: DARK MODE TOGGLE
// ========================================

const html = document.documentElement;
const darkModeToggle = document.querySelector("#darkModeToggle");

// Restore saved theme
const savedTheme = localStorage.getItem("angels-burger-theme");

if (savedTheme === "light") {
    html.classList.remove("dark");
} else if (savedTheme === "dark") {
    html.classList.add("dark");
}

function updateThemeButton() {
    const isDark = html.classList.contains("dark");

    darkModeToggle.textContent = isDark ? "☀️" : "🌙";
    darkModeToggle.setAttribute("aria-pressed", String(isDark));
    darkModeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
}

if (darkModeToggle) {
    updateThemeButton();

    darkModeToggle.addEventListener("click", () => {
        html.classList.toggle("dark");

        const theme = html.classList.contains("dark")
            ? "dark"
            : "light";

        localStorage.setItem("angels-burger-theme", theme);
        updateThemeButton();
    });
}


// ========================================
// MOBILE NAVIGATION
// ========================================

const menuToggle = document.querySelector("#menuToggle");
const mobileMenu = document.querySelector("#mobileMenu");

if (menuToggle && mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll("a");

    function closeMobileMenu() {
        mobileMenu.classList.add("hidden");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.textContent = "☰";
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = !mobileMenu.classList.contains("hidden");

        if (isOpen) {
            closeMobileMenu();
        } else {
            mobileMenu.classList.remove("hidden");
            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Close navigation menu");
            menuToggle.textContent = "✕";
        }
    });

    mobileLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });
}


// ========================================
// CONTACT FORM DEMO
// ========================================

const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");

if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.querySelector("#name").value.trim();

        formStatus.classList.remove(
            "text-red-500",
            "text-green-600",
            "dark:text-green-400"
        );

        formStatus.textContent =
            `Thank you, ${name}! Your demo message is ready. No email was sent.`;

        formStatus.classList.add(
            "text-green-600",
            "dark:text-green-400"
        );

        contactForm.reset();
    });
}


// ========================================
// AUTOMATIC COPYRIGHT YEAR
// ========================================

const yearElement = document.querySelector("#year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// ========================================
// D1 + D2 + D3 + E1 + E2 + E3
// GSAP ANIMATIONS
// ========================================

const motion = gsap.matchMedia();

motion.add("(prefers-reduced-motion: no-preference)", () => {

    // Keep animations and ScrollTriggers in this context for cleanup.
    const animationContext = gsap.context(() => {

        // D1 + D2: One timeline with defaults, stagger, and overlaps.
        const intro = gsap.timeline({
            defaults: {
                duration: 0.5,
                ease: "power2.out"
            }
        });

        // power2.out gives the navigation a smooth entrance.
        intro.from("#siteHeader", {
            y: -25,
            autoAlpha: 0
        });

        // back.out adds a playful bounce to the heading.
        intro.from(".hero-title", {
            y: 35,
            autoAlpha: 0,
            duration: 0.6,
            ease: "back.out(1.4)"
        }, "-=0.3");

        // power2.out makes the label and supporting text appear smoothly.
        intro.from(".hero-label, .hero-text", {
            y: 20,
            autoAlpha: 0,
            stagger: 0.12,
            ease: "power2.out"
        }, "-=0.35");

        // power2.out gives the buttons a clean entrance.
        intro.from(".hero-buttons > *", {
            y: 15,
            autoAlpha: 0,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.3");

        // power3.out makes the hero photo feel smooth and prominent.
        intro.from(".hero-art", {
            x: 35,
            scale: 0.95,
            autoAlpha: 0,
            duration: 0.65,
            ease: "power3.out"
        }, "-=0.4");


        // D3: REPLAY BUTTON
        const replayBtn = document.querySelector("#replayBtn");

        const replayIntro = () => {
            intro.restart();
        };

        if (replayBtn) {
            replayBtn.addEventListener("click", replayIntro);
        }


        // E1: INDIVIDUAL SCROLL REVEALS
        gsap.utils.toArray(".reveal").forEach((section) => {
            gsap.from(section, {
                y: 40,
                autoAlpha: 0,
                duration: 0.7,
                ease: "power2.out",

                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                    markers: false
                }
            });
        });


        // MENU CARD REVEALS
        gsap.from(".feature-card", {
            y: 30,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",

            scrollTrigger: {
                trigger: "#menu",
                start: "top 75%",
                toggleActions: "play none none reverse",
                markers: false
            }
        });


        // E2: SCROLL-LINKED PROGRESS BAR
        gsap.fromTo(
            "#progressBar",
            {
                scaleX: 0
            },
            {
                scaleX: 1,
                ease: "none",

                scrollTrigger: {
                    trigger: document.documentElement,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                    markers: false
                }
            }
        );


        // E3: Remove the replay event listener when the context is reverted.
        if (replayBtn) {
            animationContext.add(() => {
                return () => {
                    replayBtn.removeEventListener("click", replayIntro);
                };
            });
        }

    });

    // Clean up only animations and triggers created in this context.
    return () => {
        animationContext.revert();
    };
});


// ========================================
// E3: REDUCED MOTION SUPPORT
// ========================================

motion.add("(prefers-reduced-motion: reduce)", () => {

    // Show content immediately without entrance or scroll animations.
    gsap.set(
        [
            "#siteHeader",
            ".hero-title",
            ".hero-label",
            ".hero-text",
            ".hero-buttons > *",
            ".hero-art",
            ".hero-note",
            ".reveal",
            ".feature-card"
        ],
        {
            clearProps: "all"
        }
    );

    // Keep the progress bar static for reduced-motion users.
    gsap.set("#progressBar", {
        scaleX: 1
    });

    return () => {
        gsap.set("#progressBar", {
            clearProps: "transform"
        });
    };
});

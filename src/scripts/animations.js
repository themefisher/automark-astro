/* global gsap, ScrollTrigger, Lenis */
import { sporeCanvas } from "./particleCanvus.js";

(function () {
  "use strict";

  // Hero Video Showcase: GSAP 3D scroll tilt
  // On XL: starts scaled 0.8, rotationX 10, top -250 → scrolls to normal
  // On < XL: starts scaled 0.8, rotationX 15 → scrolls to normal
  function heroVideo() {
    const mm = gsap.matchMedia();
    const gsapVideoShowcase = document.querySelectorAll("[data-gsap-video-showcase]");
    if (!gsapVideoShowcase.length) return;

    gsapVideoShowcase.forEach((el) => {
      mm.add("(min-width: 1280px)", () => {
        gsap.set(el, { scale: 0.8, rotationX: 10, top: -250 });
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "20% 95%",
            end: "0% 30%",
            scrub: true,
            markers: false,
          },
          scale: 1,
          rotationX: 0,
          top: 0,
          ease: "none",
        });
      });

      mm.add("(max-width: 1279px)", () => {
        gsap.set(el, { scale: 0.8, rotationX: 15 });
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "20% 95%",
            end: "0% 40%",
            scrub: true,
          },
          scale: 1,
          rotationX: 0,
          ease: "none",
        });
      });
    });
  }

  // Trusted Partners: animated cycling brand logos
  function updateTrustedPartners() {
    const partners = document.querySelector("[data-trusted-brands-images]");
    if (!partners) return;

    const images = JSON.parse(partners.dataset.trustedBrandsImages);
    const MAX = 7;

    function getRandomImages(list) {
      return [...list].sort(() => 0.5 - Math.random()).slice(0, MAX);
    }

    function render(list) {
      partners.textContent = "";
      const frag = document.createDocumentFragment();
      list.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "Trusted Brand";
        img.draggable = false;
        frag.appendChild(img);
      });
      partners.appendChild(frag);
    }

    function animate() {
      const selected = getRandomImages(images);
      render(selected);
      const imgs = partners.children;

      gsap.fromTo(
        imgs,
        { opacity: 0, filter: "blur(10px)", y: -30 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.9, stagger: 0.15 }
      );

      gsap.to(imgs, {
        opacity: 0,
        filter: "blur(10px)",
        y: 20,
        duration: 0.9,
        delay: 3,
        stagger: 0.15,
        onComplete: animate,
      });
    }

    animate();
  }

  // Particle spore canvas effect
  function sporesEffect() {
    const targetElementClassName = ".heroSporeCanvas";
    sporeCanvas(
      targetElementClassName,
      140,   // particle count
      0.2,   // min size
      1.6,   // max size
      0.0,   // min speed
      0.1,   // max speed
      800    // canvas size
    );
  }

  // Pricing toggle: Monthly ↔ Yearly with animated transitions
  // Uses a hidden checkbox input with data-pricing-toggle
  // Labels with .price-toggler-btn get .active class
  // Price spans with data-price-tag-monthly / data-price-tag-yearly get .active / .inactive
  function pricingToggle() {
    const toggle = document.querySelector("[data-pricing-toggle]");
    const labels = document.querySelectorAll(".price-toggler-btn");
    if (!toggle) return;

    toggle.addEventListener("change", (e) => {
      const isYearly = e.target.checked;

      // Toggle label active states
      if (isYearly) {
        labels[0]?.classList.remove("active");
        labels[1]?.classList.add("active");
      } else {
        labels[0]?.classList.add("active");
        labels[1]?.classList.remove("active");
      }

      const monthlyElements = document.querySelectorAll("[data-price-tag-monthly]");
      const yearlyElements = document.querySelectorAll("[data-price-tag-yearly]");
      const elementsToHide = isYearly ? monthlyElements : yearlyElements;
      const elementsToShow = isYearly ? yearlyElements : monthlyElements;

      elementsToHide.forEach((el, index) => {
        setTimeout(() => {
          el.classList.remove("active");
          el.classList.add("inactive");
        }, index * 150);
      });

      elementsToShow.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add("active");
          el.classList.remove("inactive");
        }, index * 150);
      });
    });
  }

  function init() {
    // Init Lenis smooth scroll
    const lenis = new Lenis({ autoRaf: true });

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    heroVideo();
    updateTrustedPartners();
    sporesEffect();
    pricingToggle();
  }

  // Run immediately — module scripts are deferred, DOM is already ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Refresh ScrollTrigger on resize (debounced)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    }, 250);
  });
})();

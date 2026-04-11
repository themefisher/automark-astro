/* global Swiper */

(function () {
  "use strict";

  function init() {
    // Accordion
    // ----------------------------------------
    const accordions = document.querySelectorAll("[data-accordion]");
    accordions.forEach((header) => {
      header.addEventListener("click", () => {
        const accordionItem = header.parentElement;
        accordionItem.classList.toggle("active");
      });
    });

    // Tab
    // ----------------------------------------
    function setActiveTab(tabGroup, tabName) {
      const tabsNav = tabGroup.querySelector("[data-tab-nav]");
      const tabsContent = tabGroup.querySelector("[data-tab-content]");
      if (!tabsNav || !tabsContent) return;

      tabsNav.querySelectorAll("[data-tab]").forEach((tabNavItem) => {
        tabNavItem.classList.remove("active");
      });
      tabsContent.querySelectorAll("[data-tab-panel]").forEach((tabPane) => {
        tabPane.classList.remove("active");
      });

      const selectedTabNavItem = tabsNav.querySelector(
        `[data-tab="${tabName}"]`,
      );
      if (selectedTabNavItem) selectedTabNavItem.classList.add("active");
      const selectedTabPane = tabsContent.querySelector(
        `[data-tab-panel="${tabName}"]`,
      );
      if (selectedTabPane) selectedTabPane.classList.add("active");
    }

    const tabGroups = document.querySelectorAll("[data-tab-group]");
    tabGroups.forEach((tabGroup) => {
      const tabsNav = tabGroup.querySelector("[data-tab-nav]");
      if (!tabsNav) return;
      const tabsNavItem = tabsNav.querySelectorAll("[data-tab]");
      if (!tabsNavItem.length) return;
      const activeTabName = tabsNavItem[0].getAttribute("data-tab");
      setActiveTab(tabGroup, activeTabName);

      tabsNavItem.forEach((tabNavItem) => {
        tabNavItem.addEventListener("click", () => {
          const tabName = tabNavItem.dataset.tab;
          setActiveTab(tabGroup, tabName);
        });
      });
    });

    const tablist = document.querySelectorAll("[data-tab-nav] [data-tab]");
    function tabsHandler(event) {
      let index = Array.from(tablist).indexOf(event.currentTarget);
      let numbTabs = tablist.length;
      let nextId;
      if (numbTabs > 1) {
        if (event.key === "ArrowRight") {
          nextId = tablist[(index + 1) % numbTabs];
          nextId.focus();
          nextId.click();
        }
        if (event.key === "ArrowLeft") {
          nextId = tablist[(index - 1 + numbTabs) % numbTabs];
          nextId.focus();
          nextId.click();
        }
      }
    }
    tablist.forEach(function (tab) {
      tab.addEventListener("keydown", tabsHandler);
    });

    // Modal
    // ----------------------------------------
    const openModalButtons = document.querySelectorAll("[data-modal-open]");
    const closeModalButtons = document.querySelectorAll("[data-modal-close]");

    function openModal(modal) {
      if (!modal) return;
      const overlay = modal.querySelector("[data-modal-overlay]");
      modal.style.display = "block";
      if (overlay) overlay.style.display = "block";
    }

    function closeModal(modal) {
      if (!modal) return;
      const overlay = modal.querySelector("[data-modal-overlay]");
      modal.style.display = "none";
      if (overlay) overlay.style.display = "none";
    }

    openModalButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const modal = button.nextElementSibling;
        openModal(modal);
      });
    });

    closeModalButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const modal = button.closest("[data-modal]");
        closeModal(modal);
      });
    });

    // Starred Box
    const mainFeatureStarred = document.querySelectorAll("[data-is-starred]");
    mainFeatureStarred.forEach((el) => {
      const isStarred = el.getAttribute("data-is-starred");
      el.style.display = isStarred === "true" ? "block" : "none";
    });

    // BN Cards indent on desktop
    const bnCardsLayout = () => {
      const bnCards = document.querySelectorAll("[data-bn-card]");
      bnCards.forEach((card) => {
        const cardNumber = card.getAttribute("data-bn-card");
        if (cardNumber) {
          if (window.innerWidth > 1280) {
            card.style.marginInline = `${(cardNumber - 1) * 38}px`;
          } else {
            card.style.marginInline = "0px";
          }
        }
      });
    };
    window.addEventListener("resize", bnCardsLayout);
    bnCardsLayout();

    // Comparison Row - randomize images
    const comparisonRows = document.querySelectorAll(
      "[data-comparison-row-images-path]",
    );
    comparisonRows.forEach((row) => {
      const images = JSON.parse(row.dataset.comparisonRowImagesPath);
      const container = row;
      container.innerHTML = "";
      images.sort(() => 0.5 - Math.random());
      images.slice(0, Math.floor(Math.random() * 4) + 2).forEach((imgPath) => {
        const img = document.createElement("img");
        img.src = imgPath;
        img.alt = "Comparison Image";
        img.draggable = false;
        img.className = "max-h-12";
        container.appendChild(img);
      });
    });

    // Testimonial Videos - play/pause on click
    const videoContainers = document.querySelectorAll(
      "[data-testimonial-video]",
    );
    videoContainers.forEach((container) => {
      const video = container.querySelector("video");
      const toggleBtn = container.querySelector("button");
      if (!video || !toggleBtn) return;

      toggleBtn.addEventListener("click", () => {
        if (video.paused) {
          toggleBtn.setAttribute("aria-label", "Pause Video");
          toggleBtn.style.opacity = "0";
          video.play();
        } else {
          toggleBtn.setAttribute("aria-label", "Play Video");
          toggleBtn.classList.add("bg-dark/40");
          toggleBtn.style.opacity = "1";
          video.pause();
        }
      });
    });

    // Hero Video Showcase - sound toggle
    // Note: GSAP animation is handled in animations.js
    const heroVideoShowcase = document.querySelector(
      "[data-gsap-video-showcase]",
    );
    if (heroVideoShowcase) {
      const video = heroVideoShowcase.querySelector("video");
      const toggleBtn = document.getElementById("soundToggle");
      const mutedIcon = document.getElementById("mutedIcon");

      if (video && toggleBtn && mutedIcon) {
        toggleBtn.addEventListener("click", () => {
          video.muted = !video.muted;
          if (video.muted) {
            mutedIcon.classList.remove("hidden");
            toggleBtn.classList.add("bg-dark/40");
            toggleBtn.style.opacity = "1";
            toggleBtn.setAttribute("aria-label", "Unmute video");
          } else {
            mutedIcon.classList.add("hidden");
            toggleBtn.classList.remove("bg-dark/40");
            toggleBtn.style.opacity = "0";
            toggleBtn.setAttribute("aria-label", "Mute video");
          }
        });
      }
    }

    // Header reveal/hide on scroll direction
    const header = document.querySelector(".header");
    const navToggle = document.getElementById("nav-toggle");

    // Nav menu background expand/collapse
    const navMenuBgToggle = () => {
      const navToggleEl = document.getElementById("nav-toggle");
      const navMenuBg = document.getElementById("nav-menu-bg");
      const headerEl = document.querySelector(".header");

      if (
        !(navToggleEl instanceof HTMLInputElement) ||
        !(navMenuBg instanceof HTMLElement) ||
        !(headerEl instanceof HTMLElement)
      ) {
        return;
      }

      const updateBgHeight = () => {
        const rect = headerEl.getBoundingClientRect();
        if (navToggleEl.checked) {
          navMenuBg.style.height = rect.height + "px";
        } else {
          navMenuBg.style.height = "0px";
        }
      };

      navToggleEl.addEventListener("change", updateBgHeight);
      window.addEventListener("resize", updateBgHeight);
      updateBgHeight();
    };
    navMenuBgToggle();

    if (header) {
      let lastScrollY = window.scrollY;
      const scrollThreshold = 200;
      window.addEventListener("scroll", () => {
        if (navToggle && navToggle.checked) {
          header.classList.remove("hide");
          lastScrollY = window.scrollY;
          return;
        }

        if (window.scrollY > scrollThreshold) {
          if (window.scrollY < lastScrollY) {
            header.classList.remove("hide");
          } else {
            header.classList.add("hide");
          }
        } else {
          header.classList.remove("hide");
        }
        lastScrollY = window.scrollY;
      });
    }
  }

  // Run immediately — scripts are at end of body, DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

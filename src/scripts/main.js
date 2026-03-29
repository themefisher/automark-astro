/* global Swiper */

(function () {
  "use strict";

  // Testimonial Slider
  // ----------------------------------------
  const testimonialSwiper = new Swiper(".testimonial-slider", {
    spaceBetween: 24,
    loop: true,
    pagination: {
      el: ".testimonial-slider-pagination",
      type: "bullets",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });

  // Tab
  // ----------------------------------------
  function setActiveTab(tabGroup, tabName) {
    const tabsNav = tabGroup.querySelector("[data-tab-nav]");
    const tabsContent = tabGroup.querySelector("[data-tab-content]");

    tabsNav.querySelectorAll("[data-tab]").forEach((tabNavItem) => {
      tabNavItem.classList.remove("active");
    });
    tabsContent.querySelectorAll("[data-tab-panel]").forEach((tabPane) => {
      tabPane.classList.remove("active");
    });

    const selectedTabNavItem = tabsNav.querySelector(`[data-tab="${tabName}"]`);
    selectedTabNavItem.classList.add("active");
    const selectedTabPane = tabsContent.querySelector(
      `[data-tab-panel="${tabName}"]`,
    );
    selectedTabPane.classList.add("active");
  }
  const tabGroups = document.querySelectorAll("[data-tab-group]");
  tabGroups.forEach((tabGroup) => {
    const tabsNav = tabGroup.querySelector("[data-tab-nav]");
    const tabsNavItem = tabsNav.querySelectorAll("[data-tab]");
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
        if (index === numbTabs - 1) {
          nextId = tablist[0];
        }
        nextId.focus();
        nextId.click();
      }
      if (event.key === "ArrowLeft") {
        nextId = tablist[(index - 1 + numbTabs) % numbTabs];
        if (index === 0) {
          nextId = tablist[numbTabs - 1];
        }
        nextId.focus();
        nextId.click();
      }
    }
  }

  tablist.forEach(function (tab) {
    tab.addEventListener("keydown", tabsHandler);
  });

  // Accordion
  // ----------------------------------------
  const accordion = document.querySelectorAll("[data-accordion]");
  accordion.forEach((header) => {
    header.addEventListener("click", () => {
      const accordionItem = header.parentElement;
      accordionItem.classList.toggle("active");
    });
  });

  // Modal
  // ----------------------------------------
  const openModalButtons = document.querySelectorAll("[data-modal-open]");
  const closeModalButtons = document.querySelectorAll("[data-modal-close]");

  function openModal(modal) {
    if (modal === null) {
      return null;
    }
    const overlay = modal.querySelector("[data-modal-overlay]");
    modal.style.display = "block";
    overlay.style.display = "block";
  }

  function closeModal(modal) {
    if (modal === null) {
      return null;
    }
    const overlay = modal.querySelector("[data-modal-overlay]");
    modal.style.display = "none";
    overlay.style.display = "none";
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
  const mainFeatureStrred = document.querySelectorAll("[data-is-starred]");
  mainFeatureStrred.forEach((el) => {
    const isStarred = el.getAttribute("data-is-starred");
    if (isStarred === "true") {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });

  const bnCards = () => {
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

  const randomComparisonRowsImagesFiller = () => {
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
  };

  // Testimonials Video Muted Toggle
  const testimonialVideosInit = () => {
    const videoContainers = document.querySelectorAll(
      "[data-testimonial-video]",
    );

    videoContainers.forEach((container) => {
      const video = container.querySelector("video");
      const toggleBtn = container.querySelector("button");

      // Play / Pause on click
      toggleBtn.addEventListener("click", () => {
        if (video.paused) {
          toggleBtn.setAttribute("aria-label", "Play Video");
          toggleBtn.style.opacity = "0";
          // play
          video.play();
        } else {
          toggleBtn.setAttribute("aria-label", "Stop Video");
          toggleBtn.classList.add("bg-dark/40");
          toggleBtn.style.opacity = "1";
          // pause
          video.pause();
        }
      });
    });
  };

  // TODO: Work on this animation later
  const pricingToggler = () => {
    let isYearly = false;

    const toggle = document.getElementById("priceToggle");
    const monthlyEls = document.querySelectorAll("[data-price-tag-monthly]");
    const yearlyEls = document.querySelectorAll("[data-price-tag-yearly]");

    toggle.addEventListener("click", () => {
      isYearly = !isYearly;
      toggle.classList.toggle("active", isYearly);

      if (isYearly) {
        monthlyEls.forEach((el, i) => {
          setTimeout(() => el.classList.add("inactive"), i * 150);
        });

        yearlyEls.forEach((el, i) => {
          setTimeout(() => el.classList.remove("inactive"), i * 150);
        });
      } else {
        monthlyEls.forEach((el, i) => {
          setTimeout(() => el.classList.remove("inactive"), i * 150);
        });

        yearlyEls.forEach((el, i) => {
          setTimeout(() => el.classList.add("inactive"), i * 150);
        });
      }
    });
  };

  // Header: Reveal / Hide based on scroll direction after 200px
  const headerReveal = () => {
    const header = document.querySelector(".header");
    let lastScrollY = window.scrollY;
    const scrollThreshold = 200; // Minimum scroll to trigger reveal/hide

    window.addEventListener("scroll", () => {
      if (window.scrollY > scrollThreshold) {
        if (window.scrollY < lastScrollY) {
          // Scrolling up
          header.classList.remove("hide");
        } else {
          // Scrolling down
          header.classList.add("hide");
        }
      } else {
        // At the top or within threshold, always show header
        header.classList.remove("hide");
      }
      lastScrollY = window.scrollY;
    });
  };

  window.addEventListener("resize", bnCards);
  window.addEventListener("DOMContentLoaded", () => {
    bnCards();
    randomComparisonRowsImagesFiller();
    // pricingToggler();
    testimonialVideosInit();
    headerReveal();
  });
})();

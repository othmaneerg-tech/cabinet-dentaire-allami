"use strict";

// --- Theme Toggle ---
const themeToggleBtn = document.querySelector("[data-theme-toggle]") || document.getElementById("theme-toggle");
const body = document.body;

const savedTheme = localStorage.getItem("dentelo-theme") || "light-theme";
if (savedTheme === "dark-theme") {
  body.classList.add("dark-theme");
} else {
  body.classList.remove("dark-theme");
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    const isDark = body.classList.contains("dark-theme");
    localStorage.setItem("dentelo-theme", isDark ? "dark-theme" : "light-theme");
  });
}

// --- Navbar Toggle & Header active ---
const header = document.querySelector("[data-header]");
const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelector("[data-nav-toggler]");
const closeIcon = navToggler ? navToggler.querySelector(".close-icon") : null;
const menuIcon = navToggler ? navToggler.querySelector(".menu-icon") : null;
const navbarLinks = document.querySelectorAll("[data-nav-link]");

if (navToggler && navbar) {
  navToggler.addEventListener("click", () => {
    navbar.classList.toggle("active");
    const active = navbar.classList.contains("active");
    if (active) {
      if (closeIcon) closeIcon.style.display = "block";
      if (menuIcon) menuIcon.style.display = "none";
    } else {
      if (closeIcon) closeIcon.style.display = "none";
      if (menuIcon) menuIcon.style.display = "block";
    }
  });
}

if (navbarLinks.length > 0) {
  navbarLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (navbar) navbar.classList.remove("active");
      if (closeIcon) closeIcon.style.display = "none";
      if (menuIcon) menuIcon.style.display = "block";
    });
  });
}

window.addEventListener("scroll", () => {
  if (window.scrollY >= 50) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
  
  // Simple active nav link spy
  let currentSection = "";
  document.querySelectorAll("section[id]").forEach(sec => {
    const secTop = sec.offsetTop - 120;
    if (window.scrollY >= secTop) {
      currentSection = sec.getAttribute("id");
    }
  });
  
  navbarLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});

// --- Signature Bento Card 3D Tilt & Spotlight ---
const cards = document.querySelectorAll(".service-card, .review-card, .blog-card");
cards.forEach(card => {
  card.classList.add("tilt-card");
  
  // Generate Floating Particles for Bento effect (only for service cards)
  if (card.classList.contains("service-card")) {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-pressed", "false");
    card.setAttribute("title", "Afficher l'image du service");

    const particlesContainer = document.createElement("div");
    particlesContainer.className = "particles-container";
    for (let i = 0; i < 6; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      const dx = (Math.random() - 0.5) * 80;
      const dy = (Math.random() - 0.5) * 80;
      p.style.setProperty('--dx', `${dx}px`);
      p.style.setProperty('--dy', `${dy}px`);
      p.style.setProperty('--delay', `${Math.random() * 0.8}s`);
      p.style.setProperty('--duration', `${2 + Math.random() * 2}s`);
      particlesContainer.appendChild(p);
    }
    card.insertBefore(particlesContainer, card.firstChild);

    const toggleServiceImage = () => {
      const isActive = card.classList.toggle("is-image-active");
      card.setAttribute("aria-pressed", isActive ? "true" : "false");
      card.setAttribute("title", isActive ? "Afficher le texte du service" : "Afficher l'image du service");
    };

    card.addEventListener("click", toggleServiceImage);
    card.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      toggleServiceImage();
    });
  }
  
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Spotlight variables
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
    
    // 3D Tilt variables
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6; // max 6deg
    const rotateY = ((x - centerX) / centerX) * 6;  // max 6deg
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    // Reset spotlight to center gently
    card.style.setProperty("--mouse-x", `50%`);
    card.style.setProperty("--mouse-y", `50%`);
  });
});

// --- Rolling Text Setup ---
document.querySelectorAll(".rolling-text").forEach(el => {
  const text = el.innerText;
  el.innerHTML = "";
  text.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.innerText = char === " " ? "\u00A0" : char;
    span.dataset.letter = char === " " ? "\u00A0" : char;
    span.style.transitionDelay = `${i * 0.015}s`;
    el.appendChild(span);
  });
});

// --- Scroll Entrance Reveal Animation (Intersection Observer) ---
const observerOptions = {
  threshold: 0.12,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in, .slide-left, .scale-in").forEach(el => {
  observer.observe(el);
});

// --- Service Slider Page-by-Page Carousel & Pagination ---
const serviceSlider = document.querySelector("[data-service-slider]");
if (serviceSlider) {
  const cards = Array.from(serviceSlider.children);
  const paginationContainer = document.getElementById("desktop-services-pagination");

  // Create pagination dots dynamically
  if (paginationContainer) {
    paginationContainer.innerHTML = "";
    cards.forEach((_, idx) => {
      const dot = document.createElement("div");
      dot.className = `pagination-dot ${idx === 0 ? "active" : ""}`;
      dot.dataset.index = idx;
      dot.setAttribute("role", "button");
      dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);

      dot.addEventListener("click", () => {
        const cardWidth = cards[0].offsetWidth;
        const gap = 24; // gap in CSS
        serviceSlider.scrollTo({
          left: idx * (cardWidth + gap),
          behavior: "smooth"
        });
      });

      paginationContainer.appendChild(dot);
    });
  }

  // Update active dot on scroll
  const dots = paginationContainer ? paginationContainer.querySelectorAll(".pagination-dot") : [];
  const updateActiveDot = () => {
    if (cards.length === 0 || dots.length === 0) return;
    const cardWidth = cards[0].offsetWidth;
    const gap = 24;
    const scrollPos = serviceSlider.scrollLeft;

    // Calculate current card index based on scroll position
    const index = Math.round(scrollPos / (cardWidth + gap));

    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === index);
    });
  };

  serviceSlider.addEventListener("scroll", updateActiveDot);
}

// --- Multi-Language Hero Form (WhatsApp Custom Listbox) ---
const customSelect = document.getElementById("hero-custom-select");
const selectTrigger = document.getElementById("select-trigger");
const triggerText = document.getElementById("trigger-text");
const selectMenu = document.getElementById("select-dropdown-menu");
const panelLangs = document.getElementById("panel-languages");
const panelServices = document.getElementById("panel-services");
const servicesOptionsList = document.getElementById("services-options-list");
const backToLangsBtn = document.getElementById("back-to-langs");
const heroSubmitBtn = document.getElementById("hero-submit-btn");
const heroWhatsappForm = document.getElementById("hero-whatsapp-form");
const hiddenLangInput = document.getElementById("hidden-lang");
const hiddenServiceInput = document.getElementById("hidden-service");

if (customSelect && selectTrigger && triggerText && selectMenu && panelLangs && panelServices && servicesOptionsList && backToLangsBtn && heroSubmitBtn && heroWhatsappForm) {
  const translations = {
    fr: {
      btn: "RÉSERVER",
      placeholder: "Choisir un service",
      greeting: "Bonjour, j'aimerais prendre rendez-vous pour : ",
      services: {
        consultation: "Consultation générale",
        implant: "Chirurgie & Implantologie",
        ortho: "Orthodontie",
        aesthetic: "Esthétique & Blanchiment",
        emergency: "Urgence dentaire"
      }
    },
    en: {
      btn: "BOOK NOW",
      placeholder: "Choose a service",
      greeting: "Hello, I would like to book an appointment for: ",
      services: {
        consultation: "General Consultation",
        implant: "Surgery & Implantology",
        ortho: "Orthodontics",
        aesthetic: "Aesthetics & Whitening",
        emergency: "Dental Emergency"
      }
    },
    ar: {
      btn: "احجز الآن",
      placeholder: "اختر الخدمة",
      greeting: "مرحباً، أود حجز موعد من أجل: ",
      services: {
        consultation: "استشارة عامة",
        implant: "جراحة وزراعة الأسنان",
        ortho: "تقويم الأسنان",
        aesthetic: "تجميل وتبييض الأسنان",
        emergency: "حالة طوارئ أسنان"
      }
    }
  };

  let selectedLang = "fr";
  let selectedService = "";

  // Helper to update checkmarks in Lang Panel
  function updateLangCheckmarks() {
    panelLangs.querySelectorAll(".lang-option").forEach(el => {
      if (el.dataset.lang === selectedLang) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });
  }

  // Populate Services Panel based on chosen language
  function populateServices() {
    servicesOptionsList.innerHTML = "";
    const currentTrans = translations[selectedLang];

    Object.entries(currentTrans.services).forEach(([key, value]) => {
      const li = document.createElement("li");
      li.className = "option-item service-option";
      if (selectedService === key) {
        li.classList.add("active");
      }
      li.dataset.service = key;
      
      li.innerHTML = `
        <span>${value}</span>
        <span class="indicator-check"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
      `;

      li.addEventListener("click", (e) => {
        e.stopPropagation();
        selectedService = key;
        hiddenServiceInput.value = key;
        
        // Update checkmark UI
        servicesOptionsList.querySelectorAll(".service-option").forEach(opt => {
          opt.classList.toggle("active", opt.dataset.service === key);
        });

        // Set Trigger Text & Button Language
        triggerText.textContent = value;
        heroSubmitBtn.textContent = currentTrans.btn;

        // Close dropdown
        customSelect.classList.remove("open");
        selectTrigger.setAttribute("aria-expanded", "false");
      });

      servicesOptionsList.appendChild(li);
    });
  }

  // Toggle Dropdown Menu Open/Close
  selectTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = customSelect.classList.contains("open");
    if (isOpen) {
      customSelect.classList.remove("open");
      selectTrigger.setAttribute("aria-expanded", "false");
    } else {
      customSelect.classList.add("open");
      selectTrigger.setAttribute("aria-expanded", "true");
      if (!selectedService) {
        panelLangs.classList.remove("hidden");
        panelServices.classList.add("hidden");
      } else {
        panelLangs.classList.add("hidden");
        panelServices.classList.remove("hidden");
      }
    }
  });

  // Handle Language Option Clicks
  panelLangs.querySelectorAll(".lang-option").forEach(item => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedLang = item.dataset.lang;
      hiddenLangInput.value = selectedLang;

      updateLangCheckmarks();
      populateServices();

      // Transition to Service Panel
      panelLangs.classList.add("hidden");
      panelServices.classList.remove("hidden");
    });
  });

  // Handle Back to Languages Button
  backToLangsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    panelServices.classList.add("hidden");
    panelLangs.classList.remove("hidden");
  });

  // Close dropdown on click outside
  document.addEventListener("click", (e) => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove("open");
      selectTrigger.setAttribute("aria-expanded", "false");
    }
  });

  // Initialize
  updateLangCheckmarks();
  triggerText.textContent = "Choisir un service / Choose a service";

  // Form Submit Handler
  heroWhatsappForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!selectedService) {
      customSelect.classList.add("open");
      selectTrigger.setAttribute("aria-expanded", "true");
      panelLangs.classList.remove("hidden");
      panelServices.classList.add("hidden");
      return;
    }

    const currentTrans = translations[selectedLang];
    const serviceText = currentTrans.services[selectedService];
    const message = currentTrans.greeting + serviceText;
    const whatsappUrl = `https://wa.me/212666990058?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, "_blank");
  });
}

// --- Blog Video Intersection Observer ---
const blogVideos = document.querySelectorAll(".blog-card video");
if (blogVideos.length > 0) {
  // Pre-warm the videos and force rendering the first frame immediately on page load
  blogVideos.forEach(video => {
    video.preload = "auto";
    video.load();
  });

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play().catch(err => {
          console.log("Autoplay blocked or interrupted: ", err);
        });
      } else {
        entry.target.pause();
      }
    });
  }, {
    threshold: 0.1
  });

  blogVideos.forEach(video => {
    videoObserver.observe(video);
  });
}

// --- Before & After Slider Logic ---
const initBeforeAfterSliders = () => {
  const sliders = document.querySelectorAll(".image-comparison-slider");
  
  sliders.forEach((slider) => {
    const beforeWrapper = slider.querySelector(".image-before-wrapper");
    const divider = slider.querySelector(".slider-divider");
    const handle = slider.querySelector(".slider-handle");
    let isDragging = false;
    let isAutoPaused = false;
    let animationFrameId = null;
    let resumeTimeoutId = null;
    let autoStartTime = performance.now();

    const setPosition = (position) => {
      const safePosition = Math.max(8, Math.min(92, position));
      beforeWrapper.style.clipPath = `polygon(0 0, ${safePosition}% 0, ${safePosition}% 100%, 0 100%)`;
      divider.style.left = `${safePosition}%`;
      handle.style.left = `${safePosition}%`;
    };

    const startAutoSlide = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const animate = (time) => {
        if (!isDragging && !isAutoPaused) {
          const progress = ((time - autoStartTime) % 5000) / 5000;
          const position = 50 + Math.sin(progress * Math.PI * 2) * 34;
          setPosition(position);
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(animate);
    };

    const pauseAutoSlide = () => {
      clearTimeout(resumeTimeoutId);
      isAutoPaused = true;
    };

    const resumeAutoSlide = () => {
      clearTimeout(resumeTimeoutId);
      resumeTimeoutId = setTimeout(() => {
        autoStartTime = performance.now();
        isAutoPaused = false;
      }, 900);
    };
    
    const move = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const x = clientX - rect.left;
      let position = (x / rect.width) * 100;
      setPosition(position);
    };
    
    slider.addEventListener("mousedown", (e) => {
      isDragging = true;
      pauseAutoSlide();
      move(e.clientX);
    });
    
    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      move(e.clientX);
    });
    
    window.addEventListener("mouseup", () => {
      if (isDragging) resumeAutoSlide();
      isDragging = false;
    });
    
    slider.addEventListener("touchstart", (e) => {
      isDragging = true;
      pauseAutoSlide();
      move(e.touches[0].clientX);
    }, { passive: true });
    
    window.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      move(e.touches[0].clientX);
    }, { passive: true });
    
    window.addEventListener("touchend", () => {
      if (isDragging) resumeAutoSlide();
      isDragging = false;
    });

    setPosition(50);
    startAutoSlide();
  });
};

initBeforeAfterSliders();

// --- Desktop Reviews Slider Page-by-Page Carousel & Pagination ---
const desktopReviewsSlider = document.getElementById("desktop-reviews-slider");
if (desktopReviewsSlider) {
  const cards = Array.from(desktopReviewsSlider.children);
  const paginationContainer = document.getElementById("desktop-reviews-pagination");

  if (paginationContainer) {
    paginationContainer.innerHTML = "";
    cards.forEach((_, idx) => {
      const dot = document.createElement("div");
      dot.className = `pagination-dot ${idx === 0 ? "active" : ""}`;
      dot.dataset.index = idx;
      dot.setAttribute("role", "button");
      dot.setAttribute("aria-label", `Go to review ${idx + 1}`);

      dot.addEventListener("click", () => {
        const cardWidth = cards[0].offsetWidth;
        const gap = 24; // gap in CSS
        desktopReviewsSlider.scrollTo({
          left: idx * (cardWidth + gap),
          behavior: "smooth"
        });
      });

      paginationContainer.appendChild(dot);
    });
  }

  const dots = paginationContainer ? paginationContainer.querySelectorAll(".pagination-dot") : [];
  const updateActiveDot = () => {
    if (cards.length === 0 || dots.length === 0) return;
    const cardWidth = cards[0].offsetWidth;
    const gap = 24;
    const scrollPos = desktopReviewsSlider.scrollLeft;

    const index = Math.round(scrollPos / (cardWidth + gap));

    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === index);
    });
  };

  desktopReviewsSlider.addEventListener("scroll", updateActiveDot);
}

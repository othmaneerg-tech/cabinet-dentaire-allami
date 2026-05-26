/**
 * Isolated Mobile Logic for Dentelo
 */

// 1. Redirection detection to desktop if screen size changes or is desktop on load
function checkDevice() {
  if (window.innerWidth >= 768 && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.location.replace('./index.html');
  }
}
window.addEventListener('resize', checkDevice);
checkDevice();

document.addEventListener('DOMContentLoaded', () => {
  
  // 2. Mobile Nav Drawer Toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeDrawerBtn = document.getElementById('close-drawer');
  const navDrawer = document.getElementById('nav-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (hamburgerBtn && closeDrawerBtn && navDrawer) {
    hamburgerBtn.addEventListener('click', () => navDrawer.classList.add('active'));
    closeDrawerBtn.addEventListener('click', () => navDrawer.classList.remove('active'));
    
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => navDrawer.classList.remove('active'));
    });
  }

  // 3. Theme Toggle management
  const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-tab');
  
  // Check default theme from local storage
  const isDark = localStorage.getItem('dentelo-theme') === 'dark-theme';
  if (isDark) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const darkActive = document.body.classList.contains('dark-theme');
      localStorage.setItem('dentelo-theme', darkActive ? 'dark-theme' : 'light-theme');
    });
  });

  // 4. Multilingual Bottom Sheet System
  const trigger = document.getElementById('mobile-select-trigger');
  const triggerVal = document.getElementById('mobile-trigger-value');
  const backdrop = document.getElementById('sheet-backdrop');
  const closeSheet = document.getElementById('close-sheet');
  const panelLangs = document.getElementById('mobile-panel-langs');
  const panelServices = document.getElementById('mobile-panel-services');
  const servicesList = document.getElementById('mobile-services-list');
  const backToLangs = document.getElementById('mobile-back-to-langs');
  const submitBtn = document.getElementById('mobile-submit-btn');
  const sheetSubmitBtn = document.getElementById('mobile-sheet-submit-btn');

  const translations = {
    fr: {
      btn: "RÉSERVER",
      placeholder: "Choisir un service",
      greeting: "Bonjour, j'aimerais prendre rendez-vous pour : ",
      back: "Retour",
      servicesTitle: "Choisir un service",
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
      back: "Back",
      servicesTitle: "Choose a service",
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
      back: "الرجوع",
      servicesTitle: "اختر الخدمة",
      services: {
        consultation: "استشارة عامة",
        implant: "جراحة وزراعة الأسنان",
        ortho: "تقويم الأسنان",
        aesthetic: "تجميل وتبييض الأسنان",
        emergency: "حالة طوارئ أسنان"
      }
    }
  };

  let selectedLang = 'fr';
  let selectedService = '';

  function openSheet() {
    backdrop.classList.add('active');
    // If no service chosen, start with language panel
    if (!selectedService) {
      showPanel('langs');
    } else {
      showPanel('services');
    }
  }

  function closeBottomSheet() {
    backdrop.classList.remove('active');
  }

  function showPanel(panelName) {
    if (panelName === 'langs') {
      panelLangs.classList.add('active');
      panelServices.classList.remove('active');
      if (sheetSubmitBtn) sheetSubmitBtn.style.display = 'none';
    } else {
      panelLangs.classList.remove('active');
      panelServices.classList.add('active');
      populateServices();
    }
  }

  function populateServices() {
    servicesList.innerHTML = '';
    const data = translations[selectedLang];
    
    // Set titles/labels
    backToLangs.innerHTML = `&larr; ${data.back}`;

    if (selectedService) {
      if (sheetSubmitBtn) {
        sheetSubmitBtn.textContent = data.btn;
        sheetSubmitBtn.style.display = 'flex';
      }
    } else {
      if (sheetSubmitBtn) sheetSubmitBtn.style.display = 'none';
    }
    
    Object.entries(data.services).forEach(([key, val]) => {
      const div = document.createElement('div');
      div.className = `sheet-option ${selectedService === key ? 'selected' : ''}`;
      div.dataset.service = key;
      div.innerHTML = `
        <span>${val}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      `;

      div.addEventListener('click', () => {
        selectedService = key;
        triggerVal.textContent = val;
        submitBtn.textContent = data.btn;
        
        // Update selection style inside the list
        servicesList.querySelectorAll('.sheet-option').forEach(opt => {
          opt.classList.toggle('selected', opt.dataset.service === key);
        });

        // Show submit button in sheet
        if (sheetSubmitBtn) {
          sheetSubmitBtn.textContent = data.btn;
          sheetSubmitBtn.style.display = 'flex';
        }
      });

      servicesList.appendChild(div);
    });
  }

  if (trigger && backdrop && closeSheet) {
    trigger.addEventListener('click', openSheet);
    closeSheet.addEventListener('click', closeBottomSheet);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeBottomSheet();
    });

    // Language options select
    document.querySelectorAll('.mobile-lang-option').forEach(el => {
      el.addEventListener('click', () => {
        selectedLang = el.dataset.lang;
        
        // Update selection UI
        document.querySelectorAll('.mobile-lang-option').forEach(opt => {
          opt.classList.toggle('selected', opt.dataset.lang === selectedLang);
        });

        // Go to services panel
        showPanel('services');
      });
    });

    // Back to langs
    backToLangs.addEventListener('click', () => showPanel('langs'));

    // Submit Booking (from page button)
    submitBtn.addEventListener('click', () => {
      if (!selectedService) {
        openSheet();
        return;
      }
      triggerBookingRedirect();
    });

    // Submit Booking (from bottom sheet button)
    if (sheetSubmitBtn) {
      sheetSubmitBtn.addEventListener('click', () => {
        if (!selectedService) return;
        triggerBookingRedirect();
        closeBottomSheet();
      });
    }
  }

  function triggerBookingRedirect() {
    const data = translations[selectedLang];
    const serviceName = data.services[selectedService];
    const msg = data.greeting + serviceName;
    const url = `https://wa.me/212666990058?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  // 5. Sticky Tab Bar Link Hooks
  const tabReserve = document.getElementById('tab-reserve');
  if (tabReserve) {
    tabReserve.addEventListener('click', () => {
      openSheet();
    });
  }

  // --- Services Slider Page-by-Page Carousel & Pagination ---
  const slider = document.getElementById('services-slider');
  if (slider) {
    const cards = Array.from(slider.children);
    const paginationContainer = document.getElementById('services-pagination');
    
    // Create pagination dots dynamically
    if (paginationContainer) {
      paginationContainer.innerHTML = '';
      cards.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `pagination-dot ${idx === 0 ? 'active' : ''}`;
        dot.dataset.index = idx;
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        
        dot.addEventListener('click', () => {
          const cardWidth = cards[0].offsetWidth;
          const gap = 16; // gap in CSS
          slider.scrollTo({
            left: idx * (cardWidth + gap),
            behavior: 'smooth'
          });
        });
        
        paginationContainer.appendChild(dot);
      });
    }

    // Update active dot on scroll
    const dots = paginationContainer ? paginationContainer.querySelectorAll('.pagination-dot') : [];
    const updateActiveDot = () => {
      if (cards.length === 0 || dots.length === 0) return;
      const cardWidth = cards[0].offsetWidth;
      const gap = 16;
      const scrollPos = slider.scrollLeft;
      
      // Calculate current card index based on scroll position
      const index = Math.round(scrollPos / (cardWidth + gap));
      
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });
    };

    slider.addEventListener('scroll', updateActiveDot);

    // Click to flip card implementation
    cards.forEach(card => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-pressed', 'false');
      card.setAttribute('title', "Afficher l'image du service");
      
      const toggleServiceImage = () => {
        const isActive = card.classList.toggle('is-image-active');
        card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        card.setAttribute('title', isActive ? 'Afficher le texte du service' : "Afficher l'image du service");
      };
      
      card.addEventListener('click', toggleServiceImage);
      card.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        toggleServiceImage();
      });
    });
  }


  // --- Reviews Slider Page-by-Page Snap Carousel & Pagination ---
  const reviewsSlider = document.getElementById('reviews-slider');
  if (reviewsSlider) {
    const cards = Array.from(reviewsSlider.children);
    const paginationContainer = document.getElementById('reviews-pagination');

    // Create pagination dots dynamically
    if (paginationContainer) {
      paginationContainer.innerHTML = '';
      cards.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `pagination-dot ${idx === 0 ? 'active' : ''}`;
        dot.dataset.index = idx;
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', `Go to review ${idx + 1}`);

        dot.addEventListener('click', () => {
          const cardWidth = cards[0].offsetWidth;
          const gap = 16; // gap in CSS
          reviewsSlider.scrollTo({
            left: idx * (cardWidth + gap),
            behavior: 'smooth'
          });
        });

        paginationContainer.appendChild(dot);
      });
    }

    // Update active dot on scroll
    const dots = paginationContainer ? paginationContainer.querySelectorAll('.pagination-dot') : [];
    const updateActiveDot = () => {
      if (cards.length === 0 || dots.length === 0) return;
      const cardWidth = cards[0].offsetWidth;
      const gap = 16;
      const scrollPos = reviewsSlider.scrollLeft;

      // Calculate current card index based on scroll position
      const index = Math.round(scrollPos / (cardWidth + gap));

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });
    };

    reviewsSlider.addEventListener('scroll', updateActiveDot);
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
});

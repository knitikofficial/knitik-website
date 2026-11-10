/**
 * KNITIK — Official JavaScript Engine
 * Brand: KNITIK | Founder: Sagar Burman
 * Phone: +91 7089418809 | Raipur, Chhattisgarh, India
 * Specification Date: Nov 7, 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initStickyHeader();
  initMobileNav();
  initMegaDropdown();
  initCounterAnimation();
  initMarquee();
  initTestimonialCarousel();
  initFilterTabs();
  initFaqAccordion();
  initModals();
  initFloatingElements();
  initCookieConsent();
  initCustomCursor();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. Scroll Progress Bar (3px gradient line at very top)
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   2. Sticky Header with Shrink & Glass Blur
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation & Fullscreen Menu
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      // If clicking services dropdown trigger on mobile, don't close immediately
      if (link.parentElement.classList.contains('has-dropdown') && window.innerWidth < 1024) {
        return;
      }
      navMenu.classList.remove('active');
      toggleBtn.innerHTML = '☰';
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   4. Services Mega-Dropdown
   -------------------------------------------------------------------------- */
function initMegaDropdown() {
  const dropdownParents = document.querySelectorAll('.has-dropdown');
  dropdownParents.forEach(item => {
    const trigger = item.querySelector('.nav-link');
    const menu = item.querySelector('.mega-dropdown');
    if (!trigger || !menu) return;

    if (window.innerWidth < 1024) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        menu.classList.toggle('active');
      });
    }
  });
}

/* --------------------------------------------------------------------------
   5. Count Up Animation for Number Counters
   -------------------------------------------------------------------------- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target')) || 0;
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const duration = 1800; // 1.8s ease-out per spec
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;

        const easeOutQuad = t => t * (2 - t);

        const counterInterval = setInterval(() => {
          frame++;
          const progress = easeOutQuad(frame / totalFrames);
          const current = target * progress;

          if (frame >= totalFrames) {
            el.textContent = `${prefix}${target.toLocaleString('en-IN', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals
            })}${suffix}`;
            clearInterval(counterInterval);
          } else {
            el.textContent = `${prefix}${current.toLocaleString('en-IN', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals
            })}${suffix}`;
          }
        }, frameDuration);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

/* --------------------------------------------------------------------------
   6. Two-Row Marquee Pause on Hover
   -------------------------------------------------------------------------- */
function initMarquee() {
  const marquees = document.querySelectorAll('.marquee-track');
  marquees.forEach(track => {
    track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  });
}

/* --------------------------------------------------------------------------
   7. Testimonial Carousel / Slider (Drag, Touch & Auto-Play 6s)
   -------------------------------------------------------------------------- */
function initTestimonialCarousel() {
  const slider = document.querySelector('.testimonial-carousel');
  if (!slider) return;

  const track = slider.querySelector('.testimonial-track');
  const cards = slider.querySelectorAll('.testimonial-card');
  const prevBtn = slider.querySelector('.carousel-prev');
  const nextBtn = slider.querySelector('.carousel-next');
  const dotsContainer = slider.querySelector('.carousel-dots');

  if (!track || !cards.length) return;

  let currentIndex = 0;
  let autoPlayTimer = null;

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    cards.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = cards.length - 1;
    } else if (index >= cards.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    const cardWidth = cards[0].offsetWidth + 24; // width + gap
    track.scrollTo({
      left: currentIndex * cardWidth,
      behavior: 'smooth'
    });
    updateDots();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoPlay();
    });
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 6000); // 6s per slide per spec
  }

  function resetAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  startAutoPlay();

  slider.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  slider.addEventListener('mouseleave', () => startAutoPlay());
}

/* --------------------------------------------------------------------------
   8. Filter Tabs (Clients & Results Pages)
   -------------------------------------------------------------------------- */
function initFilterTabs() {
  const filterContainers = document.querySelectorAll('.filter-tabs-wrapper');
  filterContainers.forEach(wrapper => {
    const buttons = wrapper.querySelectorAll('.filter-tab-btn');
    const targetSelector = wrapper.getAttribute('data-target-cards') || '.filterable-card';
    const cards = document.querySelectorAll(targetSelector);

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter') || 'all';

        cards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          if (filter === 'all' || category === filter || category.includes(filter)) {
            card.style.display = '';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  });
}

/* --------------------------------------------------------------------------
   9. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-question');
    if (!header) return;

    header.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. Lightbox Modal for Dashboards, Proofs, Photos & Video Embeds
   -------------------------------------------------------------------------- */
function initModals() {
  let overlay = document.getElementById('globalModal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'globalModal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-content-box">
        <button class="modal-close-btn" id="modalClose" aria-label="Close modal">✕</button>
        <div id="modalBody"></div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const modalClose = overlay.querySelector('#modalClose');
  const modalBody = overlay.querySelector('#modalBody');

  const closeModal = () => {
    overlay.classList.remove('active');
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
  };

  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Image triggers
  document.querySelectorAll('[data-modal-img]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = trigger.getAttribute('data-modal-img');
      const imgTitle = trigger.getAttribute('data-modal-title') || 'Verified Metric Proof';
      const imgDesc = trigger.getAttribute('data-modal-desc') || '';

      modalBody.innerHTML = `
        <div style="text-align: center;">
          <span class="eyebrow-chip" style="margin-bottom: 0.75rem;">Verified KNITIK Campaign Proof</span>
          <h3 style="font-size: 1.6rem; margin-bottom: 0.5rem; color: #14102A;">${imgTitle}</h3>
          ${imgDesc ? `<p style="font-size: 0.95rem; color: #5E5A75; margin-bottom: 1.5rem;">${imgDesc}</p>` : ''}
          <div style="border-radius: 16px; overflow: hidden; border: 1px solid #ECE6F7; background: #000; box-shadow: 0 10px 40px rgba(20,16,42,0.15);">
            <img src="${imgSrc}" alt="${imgTitle}" style="max-height: 70vh; width: auto; max-width: 100%; margin: 0 auto; display: block;" />
          </div>
        </div>
      `;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Video triggers
  document.querySelectorAll('[data-modal-video]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const videoSrc = trigger.getAttribute('data-modal-video');
      const videoTitle = trigger.getAttribute('data-modal-title') || 'Client Video Testimonial';

      modalBody.innerHTML = `
        <div style="text-align: center;">
          <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #14102A;">${videoTitle}</h3>
          <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 16px; background: #000;">
            <iframe src="${videoSrc}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position: absolute; top:0; left: 0; width: 100%; height: 100%;"></iframe>
          </div>
        </div>
      `;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
}

/* --------------------------------------------------------------------------
   11. Floating WhatsApp Button & Back to Top (Appear after 300px scroll)
   -------------------------------------------------------------------------- */
function initFloatingElements() {
  const waBtn = document.querySelector('.floating-whatsapp');
  const bttBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    const isPast300 = window.scrollY > 300;
    if (waBtn) {
      waBtn.style.opacity = isPast300 ? '1' : '0';
      waBtn.style.pointerEvents = isPast300 ? 'all' : 'none';
      waBtn.style.transform = isPast300 ? 'scale(1)' : 'scale(0.8)';
    }
    if (bttBtn) {
      bttBtn.style.opacity = isPast300 ? '1' : '0';
      bttBtn.style.pointerEvents = isPast300 ? 'all' : 'none';
      bttBtn.style.transform = isPast300 ? 'scale(1)' : 'scale(0.8)';
    }
  }, { passive: true });

  if (bttBtn) {
    bttBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   12. Cookie Consent Banner (DPDP Act 2023 Compliance)
   -------------------------------------------------------------------------- */
function initCookieConsent() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  const consent = localStorage.getItem('knitik_cookie_consent');
  if (!consent) {
    banner.classList.add('active');
  }

  const acceptBtn = document.getElementById('cookieAccept');
  const declineBtn = document.getElementById('cookieDecline');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('knitik_cookie_consent', 'accepted');
      banner.classList.remove('active');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('knitik_cookie_consent', 'declined');
      banner.classList.remove('active');
    });
  }
}

/* --------------------------------------------------------------------------
   13. Custom Cursor (Desktop Only)
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024) {
    return; // disable on touch & mobile per spec
  }

  const cursorDot = document.createElement('div');
  const cursorRing = document.createElement('div');
  cursorDot.className = 'custom-cursor-dot';
  cursorRing.className = 'custom-cursor-ring';

  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    if (!isVisible) {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
      mouseX = ringX = e.clientX;
      mouseY = ringY = e.clientY;
      isVisible = true;
    } else {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
    isVisible = false;
  });

  const renderCursor = () => {
    if (isVisible) {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    }
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Hover expansion on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .btn, .bento-card, .faq-question, .case-card, .industry-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
  });
}

/* --------------------------------------------------------------------------
   14. Lead Contact Form -> WhatsApp Priority Booking
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('leadForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value.trim() || '';
    const phone = form.querySelector('[name="phone"]')?.value.trim() || '';
    const email = form.querySelector('[name="email"]')?.value.trim() || 'N/A';
    const service = form.querySelector('[name="service"]')?.value || 'Performance Marketing';
    const budget = form.querySelector('[name="budget"]')?.value || 'Not specified';
    const message = form.querySelector('[name="message"]')?.value.trim() || 'Ready to scale with KNITIK.';

    if (!name || !phone) {
      alert('Please provide your name and phone number.');
      return;
    }

    const waText = encodeURIComponent(
      `*New Strategy Inquiry — KNITIK Website*\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Email:* ${email}\n` +
      `*Service Required:* ${service}\n` +
      `*Monthly Ad Budget:* ${budget}\n` +
      `*Notes:* ${message}`
    );

    const waUrl = `https://api.whatsapp.com/send/?phone=917089418809&text=${waText}&type=phone_number&app_absent=0`;
    window.open(waUrl, '_blank', 'noopener');
    form.reset();
  });
}

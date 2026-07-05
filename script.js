/**
 * SATYAM PAWAR – VIDEO EDITOR PORTFOLIO
 * script.js | Pure JavaScript – No Frameworks
 * ============================================
 */

'use strict';

/* ─── DOM READY ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════════
     1. LOADER
  ══════════════════════════════════════════════ */
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    // Wait for loading bar animation (≈1.4s), then fade out
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1600);
  });

  // Prevent scroll during load
  document.body.style.overflow = 'hidden';


  /* ══════════════════════════════════════════════
     2. CUSTOM CURSOR
  ══════════════════════════════════════════════ */
  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursor-trail');

  if (cursor && cursorTrail && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Smooth trail with rAF
    function animateTrail() {
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;
      cursorTrail.style.left = trailX + 'px';
      cursorTrail.style.top  = trailY + 'px';
      requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Hover states
    const hoverTargets = document.querySelectorAll(
      'a, button, .filter-btn, .play-btn, .work-card, .service-card, input, textarea, select'
    );

    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor--hover');
        cursorTrail.classList.add('cursor-trail--hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor--hover');
        cursorTrail.classList.remove('cursor-trail--hover');
      });
    });

    // Hide on mouse leave window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorTrail.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '';
      cursorTrail.style.opacity = '';
    });
  }


  /* ══════════════════════════════════════════════
     3. NAVBAR — scroll blur + active link
  ══════════════════════════════════════════════ */
  const navbar       = document.getElementById('navbar');
  const navLinks     = document.querySelectorAll('.nav-link');
  const hamburger    = document.getElementById('hamburger');
  const mobileNav    = document.getElementById('mobile-nav');
  const mobileLinks  = document.querySelectorAll('.mobile-nav__link');

  // Blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
    toggleBackToTop();
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });

  // Active nav highlight based on scroll position
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }


  /* ══════════════════════════════════════════════
     4. SCROLL REVEAL
  ══════════════════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // once
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ══════════════════════════════════════════════
     5. HERO PARALLAX
  ══════════════════════════════════════════════ */
  const heroContent = document.querySelector('.hero__content');

  window.addEventListener('scroll', () => {
    if (heroContent) {
      const scrolled = window.scrollY;
      heroContent.style.transform = `translateY(${scrolled * 0.28}px)`;
      heroContent.style.opacity = 1 - scrolled / 600;
    }
  });


  /* ══════════════════════════════════════════════
     6. PORTFOLIO FILTER
  ══════════════════════════════════════════════ */
  /* ══════════════════════════════════════════════
     6. PORTFOLIO FILTER
  ══════════════════════════════════════════════ */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const workCards   = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Convert to lowercase to avoid case-sensitivity issues
      const filter = btn.dataset.filter.toLowerCase();

      workCards.forEach(card => {
        const cat = card.dataset.category.toLowerCase();
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'none'; // reset animation
          card.offsetHeight; /* trigger reflow */
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
  /* ══════════════════════════════════════════════
     7. VIDEO MODAL (Lightbox)
  ══════════════════════════════════════════════ */
  const modal       = document.getElementById('video-modal');
  const modalIframe = document.getElementById('modal-iframe');
  const modalTitle  = document.getElementById('modal-title');
  const modalClose  = document.getElementById('modal-close');

  function openModal(videoSrc, title) {
    modalIframe.src = videoSrc;
    modalTitle.textContent = title || '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modalIframe.src = ''; // stop video
    document.body.style.overflow = '';
  }

  // Play buttons on portfolio cards
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(btn.dataset.video, btn.dataset.title);
    });
  });

  // Close button
  modalClose.addEventListener('click', closeModal);

  // Click outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });


  /* ══════════════════════════════════════════════
     8. SHOWREEL PLAY BUTTON
  ══════════════════════════════════════════════ */
  const showreelOverlay = document.getElementById('showreel-overlay');
  const showreelIframe  = document.getElementById('showreel-iframe');
  const showreelBtn     = document.getElementById('showreel-play-btn');

  if (showreelBtn) {
    showreelBtn.addEventListener('click', () => {
      // Replace current src with autoplay version
      const src = showreelIframe.src;
      showreelIframe.src = src.includes('?')
        ? src + '&autoplay=1'
        : src + '?autoplay=1';
      showreelOverlay.classList.add('hidden');
    });
  }


  /* ══════════════════════════════════════════════
     9. COUNTER ANIMATION
  ══════════════════════════════════════════════ */
  const statNums = document.querySelectorAll('.stat-card__num');
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;

    statNums.forEach(num => {
      const target = parseInt(num.dataset.target, 10);
      const duration = 1800; // ms
      const stepTime = 16;    // ~60fps
      const steps = Math.ceil(duration / stepTime);
      let current = 0;

      const timer = setInterval(() => {
        current++;
        const value = Math.round(easeOutQuart(current / steps) * target);
        num.textContent = value;

        if (current >= steps) {
          num.textContent = target;
          clearInterval(timer);
        }
      }, stepTime);
    });
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  // Trigger counters when stats section enters viewport
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    }, { threshold: 0.3 });
    counterObserver.observe(statsSection);
  }


  /* ══════════════════════════════════════════════
     10. SKILL BARS ANIMATION
  ══════════════════════════════════════════════ */
  const skillFills = document.querySelectorAll('.skill-bar__fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.dataset.width;
        setTimeout(() => {
          fill.style.width = width + '%';
        }, 200);
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  skillFills.forEach(fill => skillObserver.observe(fill));


  /* ══════════════════════════════════════════════
     11. TESTIMONIALS SLIDER
  ══════════════════════════════════════════════ */
  const track     = document.getElementById('testi-track');
  const dotsWrap  = document.getElementById('testi-dots');
  const prevBtn   = document.getElementById('testi-prev');
  const nextBtn   = document.getElementById('testi-next');

  if (track) {
    const cards = track.querySelectorAll('.testi-card');
    let current = 0;
    let autoSlide;

    // Build dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('testi-dot');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('.testi-dot');

    function goTo(index) {
      current = (index + cards.length) % cards.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    prevBtn.addEventListener('click', () => { resetAuto(); goTo(current - 1); });
    nextBtn.addEventListener('click', () => { resetAuto(); goTo(current + 1); });

    function startAuto() {
      autoSlide = setInterval(() => goTo(current + 1), 5000);
    }

    function resetAuto() {
      clearInterval(autoSlide);
      startAuto();
    }

    startAuto();

    // Touch / swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        resetAuto();
        goTo(diff > 0 ? current + 1 : current - 1);
      }
    });
  }


  /* ══════════════════════════════════════════════
     12. CONTACT FORM
  ══════════════════════════════════════════════ */
  const contactForm  = document.getElementById('contact-form');
  const formSuccess  = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = contactForm.querySelector('#name').value.trim();
      const email   = contactForm.querySelector('#email').value.trim();
      const message = contactForm.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        shakeForm();
        return;
      }

      // Simulate send (replace with Formspree / EmailJS / fetch endpoint)
      const submitBtn = contactForm.querySelector('button[type="submit"] span');
      submitBtn.textContent = 'Sending…';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.textContent = 'Send Message';
        formSuccess.classList.add('visible');
        setTimeout(() => formSuccess.classList.remove('visible'), 5000);
      }, 1200);
    });

    function shakeForm() {
      contactForm.style.animation = 'shake 0.4s ease';
      setTimeout(() => { contactForm.style.animation = ''; }, 400);
    }
  }


  /* ══════════════════════════════════════════════
     13. BACK TO TOP
  ══════════════════════════════════════════════ */
  const backToTopBtn = document.getElementById('back-to-top');

  function toggleBackToTop() {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ══════════════════════════════════════════════
     14. FOOTER YEAR
  ══════════════════════════════════════════════ */
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();


  /* ══════════════════════════════════════════════
     15. HERO STAGGERED ENTRANCE
  ══════════════════════════════════════════════ */
  const heroRevealEls = document.querySelectorAll('.hero .reveal');

  // Stagger delays after loader
  setTimeout(() => {
    heroRevealEls.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, i * 120 + 200);
    });
  }, 1700);

}); // end DOMContentLoaded


/* ─── GLOBAL CSS ANIMATION ADDITIONS (injected via JS) ─────── */
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
})();

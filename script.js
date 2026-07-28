/* ============================================================
   SECURELY US — Interactions & Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── GSAP Registration ──────────────────────────────────────
  gsap.registerPlugin(ScrollTrigger);

  // ── Custom Cursor ──────────────────────────────────────────
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (cursor && follower && window.innerWidth > 600) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1, ease: 'power1.out' });
    });

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      gsap.set(follower, { x: followerX, y: followerY });
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    document.addEventListener('mouseleave', () => {
      gsap.to([cursor, follower], { opacity: 0, duration: 0.3 });
    });
    document.addEventListener('mouseenter', () => {
      gsap.to([cursor, follower], { opacity: 1, duration: 0.3 });
    });
  }

  // ── Navigation ─────────────────────────────────────────────
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  const toggleMenu = () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  };
  hamburger.addEventListener('click', toggleMenu);
  mobileLinks.forEach(link => link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }));

  // ── Dropdown ───────────────────────────────────────────────
  const dropdownTrigger = document.querySelector('.has-dropdown');
  if (dropdownTrigger) {
    // Touch / click support (hover handled by CSS)
    dropdownTrigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        dropdownTrigger.classList.toggle('open');
      }
    });
    document.addEventListener('click', (e) => {
      if (!dropdownTrigger.contains(e.target)) {
        dropdownTrigger.classList.remove('open');
      }
    });
    // Keyboard accessibility
    dropdownTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') dropdownTrigger.classList.remove('open');
    });
  }

  // ── Hero Entrance Animation ────────────────────────────────
  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
    .to('.hero-headline', { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.6')
    .to('.hero-subline', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6')
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .to('.hero-stat-strip', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4');

  // Hero stat number count-up
  setTimeout(() => {
    const statNums = document.querySelectorAll('.stat-num');
    statNums.forEach(el => {
      const text = el.textContent;
      const hasPlus = text.includes('+');
      const hasPct = text.includes('%');
      const num = parseInt(text.replace(/[^0-9]/g, ''));
      gsap.fromTo(el,
        { textContent: 0 },
        {
          textContent: num,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function () {
            const val = Math.round(this.targets()[0].textContent);
            el.textContent = val + (hasPlus ? '+' : '') + (hasPct ? '%' : '');
          }
        }
      );
    });
  }, 1400);

  // Floating particles in hero
  const particleContainer = document.getElementById('heroParticles');
  if (particleContainer) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: ${Math.random() > 0.5 ? 'rgba(181,101,74,0.25)' : 'rgba(74,103,65,0.2)'};
        border-radius: 50%;
        left: ${Math.random() * 80 + 5}%;
        top: ${Math.random() * 80 + 10}%;
      `;
      particleContainer.appendChild(p);
      gsap.to(p, {
        y: `${(Math.random() - 0.5) * 80}px`,
        x: `${(Math.random() - 0.5) * 40}px`,
        opacity: Math.random() * 0.5 + 0.2,
        duration: Math.random() * 6 + 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 3,
      });
    }
  }

  // ── Scroll Reveal ──────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || 0);
          setTimeout(() => el.classList.add('revealed'), delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  // ── GSAP Parallax ─────────────────────────────────────────
  gsap.to('.hero-botanical', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
  });

  // Service cards stagger
  gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.fromTo(card,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        delay: (i % 3) * 0.12,
      }
    );
  });

  // Approach steps
  gsap.utils.toArray('.approach-step').forEach((step, i) => {
    gsap.fromTo(step,
      { x: -30, opacity: 0 },
      {
        x: 0, opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: step, start: 'top 88%' },
        delay: i * 0.15,
      }
    );
  });

  // Modality cards
  gsap.utils.toArray('.modality-card').forEach((card, i) => {
    gsap.fromTo(card,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1, opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: card, start: 'top 90%' },
        delay: i * 0.08,
      }
    );
  });

  // CTA banner text split animation
  gsap.fromTo('.cta-banner-inner h2',
    { y: 40, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.cta-banner', start: 'top 70%' },
    }
  );

  // ── Testimonials Slider ────────────────────────────────────
  const track = document.getElementById('testimonialsTrack');
  const cards = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('tnavDots');
  const prevBtn = document.getElementById('tnavPrev');
  const nextBtn = document.getElementById('tnavNext');

  if (track && dotsContainer && cards.length > 0) {
    let currentSlide = 0;
    let slidesPerView = window.innerWidth < 700 ? 1 : (window.innerWidth < 1000 ? 2 : 3);
    const totalSlides = cards.length;
    const maxSlide = totalSlides - slidesPerView;

    // Build dots
    for (let i = 0; i <= maxSlide; i++) {
      const dot = document.createElement('button');
      dot.className = 'tnav-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    const goToSlide = (index) => {
      currentSlide = Math.max(0, Math.min(index, maxSlide));
      const cardWidth = cards[0].offsetWidth + 24;
      gsap.to(track, {
        x: -(currentSlide * cardWidth),
        duration: 0.6,
        ease: 'power3.inOut',
      });
      document.querySelectorAll('.tnav-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    };

    prevBtn?.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn?.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Auto-advance
    let autoSlide = setInterval(() => goToSlide(currentSlide + 1 > maxSlide ? 0 : currentSlide + 1), 5000);
    track.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => goToSlide(currentSlide + 1 > maxSlide ? 0 : currentSlide + 1), 5000);
    });

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    });

    window.addEventListener('resize', () => {
      slidesPerView = window.innerWidth < 700 ? 1 : (window.innerWidth < 1000 ? 2 : 3);
      goToSlide(0);
    });
  }

  // ── FAQ Accordion ──────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';

      // Close all
      faqItems.forEach(fi => {
        fi.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        fi.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Open clicked (if wasn't open)
      if (!isOpen) {
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ── Contact: booking handled by the inline TidyCal embed ───
  // ── Smooth anchor scrolling with offset ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Active nav link highlight ──────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--terracotta)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // ── TidyCal Booking Popup ──────────────────────────────────
  // 👇 PASTE YOUR TIDYCAL LINK HERE (e.g. https://tidycal.com/yourname/30-minute-consultation)
  const TIDYCAL_URL = 'https://tidycal.com/YOUR-USERNAME';

  (function initBookingPopup() {
    // Stay dormant until a real link is set — booking buttons keep their scroll behaviour.
    if (!TIDYCAL_URL || TIDYCAL_URL.includes('YOUR-USERNAME')) return;

    // Build the modal once and reuse it.
    const overlay = document.createElement('div');
    overlay.className = 'booking-modal';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="booking-backdrop" data-book-close></div>
      <div class="booking-dialog" role="dialog" aria-modal="true" aria-label="Book a session">
        <button class="booking-close" data-book-close aria-label="Close booking">&times;</button>
        <div class="booking-frame-wrap"></div>
      </div>`;
    document.body.appendChild(overlay);
    const frameWrap = overlay.querySelector('.booking-frame-wrap');

    const openModal = () => {
      // Lazy-load the calendar the first time it's opened.
      if (!frameWrap.querySelector('iframe')) {
        const iframe = document.createElement('iframe');
        iframe.src = TIDYCAL_URL;
        iframe.loading = 'lazy';
        iframe.title = 'Book a session with Rebeca Islam';
        frameWrap.appendChild(iframe);
      }
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    // Intercept every booking CTA (all link to #contact). Capture phase so this
    // runs before the smooth-scroll handler on the same anchors.
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href$="#contact"]');
      if (!link) return;
      e.preventDefault();
      e.stopPropagation();
      // Close the mobile menu if it happens to be open.
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      openModal();
    }, true);

    overlay.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-book-close')) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });
  })();

});

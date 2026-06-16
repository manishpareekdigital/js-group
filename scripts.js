/**
 * JS Group - Luxury Website Interactions & Scroll Engines
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbarScroll();
  initMobileMenu();
  initStatsCounter();
  initInteractiveMap();
  initVideoFallback();
  initInquiryForm();
  initNewsletterForm();
  initScrollReveal();
});

/**
 * Handle high-end preloader screen removal
 */
function initPreloader() {
  const preloader = document.getElementById('preloader-container');
  if (!preloader) return;

  const fadeOutPreloader = () => {
    preloader.classList.add('fade-out');
    // Enable scroll after fade out begins
    document.body.style.overflow = '';
    
    setTimeout(() => {
      preloader.style.display = 'none';
      // Trigger animations for elements in view on initial load
      triggerInitialReveal();
    }, 1000);
  };

  // Safe fallback to hide preloader if loading takes too long (e.g. slow video download)
  const safeTimeout = setTimeout(fadeOutPreloader, 3000);

  window.addEventListener('load', () => {
    clearTimeout(safeTimeout);
    // Add small aesthetic delay for the drawing animation to complete
    setTimeout(fadeOutPreloader, 1500);
  });
}

/**
 * Custom function to reveal elements visible at start
 */
function triggerInitialReveal() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('active');
    }
  });
}

/**
 * Changes navbar styling on scrolling down
 */
function initNavbarScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle-btn');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-nav-overlay');
  const navLinks = document.querySelectorAll('.mobile-link');

  if (!toggleBtn || !drawer || !overlay) return;

  const toggleMenu = () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      `;
    } else {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    }
  };

  toggleBtn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (drawer.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

/**
 * Statistics Count-up Animation
 */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.hero-stat-number');
  if (statNumbers.length === 0) return;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => observer.observe(num));

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function updateNumber(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentValue = Math.floor(easedProgress * target);
      
      if (target >= 1000) {
        // Format large numbers with comma and plus (e.g. 2,500+)
        element.textContent = currentValue.toLocaleString() + '+';
      } else {
        element.textContent = currentValue + '+';
      }

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = target.toLocaleString() + '+';
      }
    }

    requestAnimationFrame(updateNumber);
  }
}

/**
 * Interactive Branches Map Marker Selector
 */
function initInteractiveMap() {
  const markers = document.querySelectorAll('.map-marker');
  const slides = document.querySelectorAll('.branch-info-slide');

  if (markers.length === 0 || slides.length === 0) return;

  const activateBranch = (branchId) => {
    // Deactivate all slides
    slides.forEach(slide => {
      slide.classList.remove('active');
    });

    // Activate the targeted slide
    const activeSlide = document.getElementById(`slide-${branchId}`);
    if (activeSlide) {
      activeSlide.classList.add('active');
    }
  };

  markers.forEach(marker => {
    const branch = marker.getAttribute('data-branch');
    
    // Desktop hover & click support
    marker.addEventListener('mouseenter', () => activateBranch(branch));
    marker.addEventListener('click', (e) => {
      e.preventDefault();
      activateBranch(branch);
    });
  });
}

/**
 * Video Background Error Checker + Canvas Particle Backdrop Fallback
 */
function initVideoFallback() {
  const video = document.getElementById('hero-video');
  const canvas = document.getElementById('particles-canvas');

  if (!video || !canvas) return;

  const startParticles = () => {
    canvas.style.display = 'block';
    
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const count = 60;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#020B07';
      ctx.fillRect(0, 0, width, height);

      // Radial dark forest green glow overlay in center
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 10,
        width / 2, height / 2, Math.max(width, height) / 1.5
      );
      gradient.addColorStop(0, 'rgba(11, 61, 46, 0.35)');
      gradient.addColorStop(1, 'rgba(2, 11, 7, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197, 160, 89, ${p.alpha})`; // Gold particles
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    animate();
  };

  // Trigger fallback if video fails to load or is slow
  video.addEventListener('error', () => {
    console.warn('Video failed to load, launching particle fallback.');
    startParticles();
  });

  // Check state after a delay to ensure video plays
  setTimeout(() => {
    if (video.paused || video.readyState < 3) {
      console.log('Video slow to play/paused, displaying particles.');
      startParticles();
    }
  }, 1000);
}

/**
 * Handle Contact specification form submission
 */
function initInquiryForm() {
  const form = document.getElementById('inquiry-form');
  const feedback = document.getElementById('form-feedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing Specification...';

    // Simulated luxury database post
    setTimeout(() => {
      feedback.textContent = 'Specification received. An architectural manager will contact you within 2 business hours.';
      feedback.className = 'form-response success';
      
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      
      form.reset();

      setTimeout(() => {
        feedback.style.display = 'none';
        feedback.className = 'form-response';
      }, 7000);
      
    }, 1800);
  });
}

/**
 * Handle Newsletter form submission
 */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const originalPlaceholder = input.placeholder;

    input.value = '';
    input.placeholder = 'Subscribed successfully!';
    input.disabled = true;

    setTimeout(() => {
      input.disabled = false;
      input.placeholder = originalPlaceholder;
    }, 4000);
  });
}

/**
 * Apple-style element scroll reveal animation handler
 */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  if (elements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
}

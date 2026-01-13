(() => {
  'use strict';

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Navigation scroll effect
  const nav = document.querySelector('.main-nav');
  if (nav) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 100) {
        nav.style.background = 'rgba(10, 10, 20, 0.98)';
        nav.style.boxShadow = '0 4px 30px rgba(0, 245, 212, 0.1)';
      } else {
        nav.style.background = 'rgba(10, 10, 20, 0.9)';
        nav.style.boxShadow = 'none';
      }
      lastScroll = currentScroll;
    });
  }

  // GSAP reveal animations
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero elements
    gsap.from('.hero-badge', {
      y: -30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out'
    });

    gsap.from('.hero-title', {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.4,
      ease: 'power3.out'
    });

    gsap.from('.hero-subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
      ease: 'power3.out'
    });

    gsap.from('.hero-cta', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.8,
      ease: 'power3.out'
    });

    // Feature cards with stagger
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
      gsap.fromTo(card,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Science blocks
    gsap.utils.toArray('.science-block').forEach((block, i) => {
      gsap.fromTo(block,
        { x: i % 2 === 0 ? -80 : 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Equation cards
    gsap.utils.toArray('.equation-card').forEach((card, i) => {
      gsap.fromTo(card,
        { y: 40, opacity: 0, rotateX: 10 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.6,
          delay: i * 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Neurology showcase
    gsap.utils.toArray('.neuro-card').forEach((card, i) => {
      gsap.fromTo(card,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          delay: i * 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Math categories
    gsap.utils.toArray('.math-category').forEach((cat, i) => {
      gsap.fromTo(cat,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cat,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Unified theory section
    const unifiedSection = document.querySelector('.unified-theory');
    if (unifiedSection) {
      gsap.fromTo(unifiedSection,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: unifiedSection,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo('.master-equation',
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          delay: 0.3,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: '.master-equation',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Pricing tiers
    gsap.utils.toArray('.price-tier').forEach((tier, i) => {
      gsap.fromTo(tier,
        { y: 80, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: tier,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.fromTo(header,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  // Intersection Observer for equation highlighting
  const equationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('equation-visible');
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.equation-display, .master-equation').forEach(eq => {
    equationObserver.observe(eq);
  });

  // Stripe Payment Links
  document.querySelectorAll('.checkout-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const link = btn.getAttribute('data-payment-link');
      if (!link || link.includes('test_')) {
        alert('Configure a real Stripe Payment Link on this button before going live.');
        return;
      }
      window.location.href = link;
    });
  });

  // PayPal buttons
  function renderPayPal(node, plan) {
    if (!window.paypal) return;
    const prices = {
      'researcher': '99.00',
      'professional': '299.00',
      'enterprise': '799.00'
    };
    paypal.Buttons({
      style: { layout: 'horizontal', color: 'blue', shape: 'pill', label: 'paypal' },
      createOrder: (data, actions) => actions.order.create({
        purchase_units: [{
          description: `That AI Guy – ${plan} plan`,
          amount: { value: prices[plan] || '99.00' }
        }]
      }),
      onApprove: (data, actions) => actions.order.capture().then(() => {
        alert('Payment received. Welcome to That AI Guy! Check your email for next steps.');
      }),
    }).render(node);
  }
  document.querySelectorAll('.paypal').forEach((el) => {
    renderPayPal(el, el.getAttribute('data-plan') || 'researcher');
  });

  // Contact form handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      console.log('Form submitted:', data);
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
    });
  }

  // Typing effect for hero subtitle
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle && heroSubtitle.textContent) {
    const originalText = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    let charIndex = 0;

    setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (charIndex < originalText.length) {
          heroSubtitle.textContent += originalText[charIndex];
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 30);
    }, 1200);
  }

  // Parallax effect for floating orbs
  const orbs = document.querySelectorAll('.floating-orb');
  if (orbs.length > 0) {
    window.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 20;
        const x = mouseX * speed;
        const y = mouseY * speed;
        orb.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }

  // MathJax re-render on dynamic content
  if (window.MathJax) {
    const reRenderMath = () => {
      if (MathJax.typesetPromise) {
        MathJax.typesetPromise().catch((err) => console.log('MathJax error:', err));
      }
    };

    // Debounced re-render
    let mathTimeout;
    const debouncedRender = () => {
      clearTimeout(mathTimeout);
      mathTimeout = setTimeout(reRenderMath, 100);
    };

    // Observe for dynamic content changes
    const observer = new MutationObserver(debouncedRender);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Performance optimization: Pause animations when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.body.classList.add('animations-paused');
    } else {
      document.body.classList.remove('animations-paused');
    }
  });

  console.log('That AI Guy - Website initialized');
})();

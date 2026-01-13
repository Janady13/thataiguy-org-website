/* ============================================
   THE HIVE AGI - Interactive Equations & Effects
   Particle Systems and Animation Controllers
   ============================================ */

(() => {
  // ============================================
  // PARTICLE BACKGROUND SYSTEM
  // ============================================
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    createParticleBackground(particlesContainer);
  }

  function createParticleBackground(container) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    const colors = [
      'rgba(6, 182, 212, 0.5)',   // Cyan
      'rgba(139, 92, 246, 0.5)',  // Purple
      'rgba(236, 72, 153, 0.4)',  // Pink
      'rgba(16, 185, 129, 0.4)',  // Green
    ];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.2;
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += 0.02;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        const currentOpacity = this.opacity * (0.5 + Math.sin(this.pulse) * 0.5);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace('0.5)', `${currentOpacity})`).replace('0.4)', `${currentOpacity})`);
        ctx.fill();
      }
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 150);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawConnections();

      for (const particle of particles) {
        particle.update();
        particle.draw();
      }

      animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });

    resize();
    initParticles();
    animate();
  }

  // ============================================
  // SCROLL-TRIGGERED ANIMATIONS
  // ============================================
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Animate equation cards on scroll
    gsap.utils.toArray('.equation-card').forEach((card, i) => {
      gsap.fromTo(card,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: i * 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Animate showcase items
    gsap.utils.toArray('.showcase-item').forEach((item, i) => {
      gsap.fromTo(item,
        { y: 30, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: i * 0.03,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Animate neuro cards
    gsap.utils.toArray('.neuro-card').forEach((card, i) => {
      gsap.fromTo(card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: i * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Animate synthesis cards
    gsap.utils.toArray('.synthesis-card').forEach((card, i) => {
      gsap.fromTo(card,
        { x: i % 2 === 0 ? -30 : 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Animate section headers
    gsap.utils.toArray('.section-header').forEach((header) => {
      gsap.fromTo(header,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Animate the unified equation
    const unifiedEquation = document.querySelector('.unified-equation');
    if (unifiedEquation) {
      gsap.fromTo(unifiedEquation,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: unifiedEquation,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Parallax effect on science blocks
    gsap.utils.toArray('.science-visual').forEach((visual) => {
      gsap.fromTo(visual,
        { y: 50 },
        {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: visual,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    });

    // Cards and tiers hover animation enhancement
    gsap.utils.toArray('.card, .tier').forEach((el) => {
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  // ============================================
  // TYPING ANIMATION FOR EQUATIONS
  // ============================================
  function initTypingAnimation() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const equationElements = document.querySelectorAll('.equation');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          entry.target.classList.add('animated');
          animateEquation(entry.target);
        }
      });
    }, observerOptions);

    equationElements.forEach(el => observer.observe(el));
  }

  function animateEquation(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(10px)';

    setTimeout(() => {
      element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 100);
  }

  // ============================================
  // HOVER EFFECTS FOR EQUATION CARDS
  // ============================================
  function initHoverEffects() {
    const cards = document.querySelectorAll('.equation-card, .showcase-item, .neuro-card, .synthesis-card');

    cards.forEach(card => {
      card.addEventListener('mouseenter', function(e) {
        this.style.transform = 'translateY(-4px) scale(1.02)';
      });

      card.addEventListener('mouseleave', function(e) {
        this.style.transform = 'translateY(0) scale(1)';
      });

      // Add subtle mouse tracking effect
      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', function(e) {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR NAVIGATION
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ============================================
  // COUNTER ANIMATION FOR METRICS
  // ============================================
  function initCounterAnimation() {
    const counters = document.querySelectorAll('.metric-card span');

    const animateCounter = (element, target) => {
      const duration = 2000;
      const start = 0;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * easeOutQuart);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };

      requestAnimationFrame(updateCounter);
    };

    // Observe metrics for animation trigger
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          const targetValue = parseInt(entry.target.dataset.target || '0');
          if (targetValue > 0) {
            animateCounter(entry.target, targetValue);
          }
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  // ============================================
  // MATHJAX RE-RENDER ON VISIBILITY
  // ============================================
  function initMathJaxRefresh() {
    if (window.MathJax) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.classList.contains('mathjax-rendered')) {
            entry.target.classList.add('mathjax-rendered');
            MathJax.typesetPromise([entry.target]).catch(err => console.log('MathJax error:', err));
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.equation').forEach(eq => observer.observe(eq));
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initHoverEffects();
    initCounterAnimation();

    // Delay MathJax init to ensure it's loaded
    setTimeout(initMathJaxRefresh, 1000);
  });

  // Initialize typing animation after page load
  window.addEventListener('load', () => {
    initTypingAnimation();
  });

})();

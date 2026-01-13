/* ============================================
   THE HIVE AGI - Main Application Controller
   ============================================ */

(() => {
  // ============================================
  // FOOTER YEAR
  // ============================================
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ============================================
  // GSAP SCROLL ANIMATIONS
  // ============================================
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero content animation
    gsap.fromTo('.hero-copy',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out' }
    );

    gsap.fromTo('.hero-badge',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, delay: 0.4, ease: 'back.out(1.7)' }
    );

    gsap.fromTo('.metrics',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: 'power2.out' }
    );

    // Navigation scroll effect
    ScrollTrigger.create({
      start: 'top top',
      end: 99999,
      onUpdate: (self) => {
        const nav = document.querySelector('.nav');
        if (nav) {
          if (self.direction === 1 && self.scroll() > 100) {
            nav.style.transform = 'translateY(-100%)';
          } else {
            nav.style.transform = 'translateY(0)';
          }
        }
      }
    });

    // Refresh ScrollTrigger after MathJax renders
    if (window.MathJax) {
      MathJax.startup.promise.then(() => {
        ScrollTrigger.refresh();
      });
    }
  }

  // ============================================
  // STRIPE PAYMENT LINKS
  // ============================================
  document.querySelectorAll('.checkout').forEach((btn) => {
    btn.addEventListener('click', () => {
      const link = btn.getAttribute('data-payment-link');
      if (!link || link.includes('test_') || link.includes('4gMeVf55l0GF7qO4Oj2Nq15')) {
        showNotification('Configure a real Stripe Payment Link before going live.', 'warning');
        return;
      }
      window.location.href = link;
    });
  });

  // ============================================
  // PAYPAL BUTTONS
  // ============================================
  function renderPayPal(node, plan) {
    if (!window.paypal) return;

    const prices = {
      starter: '99.00',
      pro: '299.00',
      biz: '799.00'
    };

    paypal.Buttons({
      style: {
        layout: 'horizontal',
        color: 'blue',
        shape: 'pill',
        label: 'paypal',
        height: 40
      },
      createOrder: (data, actions) => actions.order.create({
        purchase_units: [{
          description: `The Hive AGI – ${plan} plan`,
          amount: { value: prices[plan] || '99.00' }
        }]
      }),
      onApprove: (data, actions) => actions.order.capture().then(() => {
        showNotification('Payment received successfully. Thank you!', 'success');
      }),
      onError: (err) => {
        console.error('PayPal error:', err);
        showNotification('Payment failed. Please try again.', 'error');
      }
    }).render(node);
  }

  document.querySelectorAll('.paypal').forEach((el) => {
    renderPayPal(el, el.getAttribute('data-plan') || 'starter');
  });

  // ============================================
  // NOTIFICATION SYSTEM
  // ============================================
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">&times;</button>
    `;

    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
        .notification {
          position: fixed;
          bottom: 24px;
          right: 24px;
          padding: 16px 24px;
          border-radius: 12px;
          background: rgba(17, 24, 39, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f9fafb;
          font-size: 0.9375rem;
          display: flex;
          align-items: center;
          gap: 16px;
          z-index: 9999;
          animation: slideIn 0.3s ease;
          max-width: 400px;
        }
        .notification button {
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
        .notification button:hover {
          color: #f9fafb;
        }
        .notification-success {
          border-color: rgba(16, 185, 129, 0.5);
          background: rgba(16, 185, 129, 0.1);
        }
        .notification-warning {
          border-color: rgba(245, 158, 11, 0.5);
          background: rgba(245, 158, 11, 0.1);
        }
        .notification-error {
          border-color: rgba(239, 68, 68, 0.5);
          background: rgba(239, 68, 68, 0.1);
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================
  document.addEventListener('keydown', (e) => {
    // Press '/' to scroll to top
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
      const activeElement = document.activeElement;
      if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // Press 'Escape' to close any open modals/notifications
    if (e.key === 'Escape') {
      document.querySelectorAll('.notification').forEach(n => n.remove());
    }
  });

  // ============================================
  // PERFORMANCE OPTIMIZATION
  // ============================================
  // Lazy load images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  function initMobileMenu() {
    const nav = document.querySelector('.nav nav');
    if (!nav) return;

    // Create mobile menu button if on mobile
    if (window.innerWidth <= 900) {
      const menuBtn = document.createElement('button');
      menuBtn.className = 'mobile-menu-btn';
      menuBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      `;
      menuBtn.style.cssText = `
        background: none;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        padding: 8px;
        cursor: pointer;
        color: #f9fafb;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      menuBtn.addEventListener('click', () => {
        nav.classList.toggle('mobile-open');
        if (nav.classList.contains('mobile-open')) {
          nav.style.cssText = `
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(3, 7, 18, 0.98);
            backdrop-filter: blur(20px);
            padding: 16px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          `;
        } else {
          nav.style.cssText = 'display: none;';
        }
      });

      document.querySelector('.nav').appendChild(menuBtn);
    }
  }

  // ============================================
  // ANALYTICS EVENT TRACKING
  // ============================================
  function trackEvent(category, action, label) {
    // Google Analytics 4
    if (window.gtag) {
      gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }
    // Console log for development
    console.log(`Event: ${category} - ${action} - ${label}`);
  }

  // Track button clicks
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.textContent.trim() || 'Unknown Button';
      trackEvent('Button', 'Click', label);
    });
  });

  // Track section views
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || 'unknown';
          trackEvent('Section', 'View', sectionId);
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('section[id]').forEach(section => {
      sectionObserver.observe(section);
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();

    // Add loaded class for CSS transitions
    document.body.classList.add('loaded');

    // Log initialization
    console.log('%c🐝 The Hive AGI', 'font-size: 20px; font-weight: bold; color: #06b6d4;');
    console.log('%cCollective Intelligence, Mathematically Evolved.', 'font-size: 12px; color: #8b5cf6;');
  });

  // ============================================
  // EXPOSE GLOBAL UTILITIES
  // ============================================
  window.HiveAGI = {
    showNotification,
    trackEvent
  };

})();

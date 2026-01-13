(() => {
  // Footer year
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  // GSAP reveal
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.card, .tier').forEach((el) => {
      gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
  }

  // Stripe Payment Links (replace data-payment-link)
  document.querySelectorAll('.checkout').forEach((btn) => {
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
    paypal.Buttons({
      style: { layout: 'horizontal', color: 'blue', shape: 'pill', label: 'paypal' },
      createOrder: (data, actions) => actions.order.create({
        purchase_units: [{
          description: `The Hive AGI – ${plan} plan`,
          amount: { value: plan === 'starter' ? '99.00' : plan === 'pro' ? '299.00' : '799.00' }
        }]
      }),
      onApprove: (data, actions) => actions.order.capture().then(() => alert('Payment received. Thank you!')),
    }).render(node);
  }
  document.querySelectorAll('.paypal').forEach((el) => renderPayPal(el, el.getAttribute('data-plan') || 'starter'));
})();


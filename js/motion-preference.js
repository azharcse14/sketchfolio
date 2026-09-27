/* User-facing motion preference. Native OS preference always takes precedence.
   Saves only in this visitor's localStorage; does not affect others. */
(() => {
  'use strict';
  const os = matchMedia('(prefers-reduced-motion: reduce)');
  let manual = false;
  try { manual = localStorage.getItem('azharul-reduced-motion') === 'true'; } catch (_) {}
  const isReduced = () => os.matches || manual;
  document.documentElement.classList.toggle('reduce-motion', manual);
  window.portfolioReducedMotion = {get matches(){return isReduced();}};
  const fire = () => dispatchEvent(new CustomEvent('portfolio:motionchange', {detail:{reduced:isReduced()}}));
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('motion-toggle');
    if (!button) return;
    const sync = () => {
      const disabled = os.matches;
      button.disabled = disabled;
      button.setAttribute('aria-pressed', String(isReduced()));
      button.setAttribute('aria-label', disabled ? 'Reduced motion enabled by device settings' : (manual ? 'Turn animations back on' : 'Turn on reduced motion'));
      const label = button.querySelector('.ink');
      const text = disabled ? 'system: less motion' : (manual ? 'allow animation' : 'less motion');
      if (window.PenLetters?.paint) window.PenLetters.paint(label, text);
      else {label.textContent = text;label.setAttribute('data-ink', text);}
      button.querySelector('small').textContent = disabled ? 'Your device prefers fewer effects' : (manual ? 'Animation is currently reduced' : 'Skip long animations if you prefer');
      button.querySelector('.motion-check').textContent = isReduced() ? '✓' : '○';
    };
    button.addEventListener('click', () => {
      if (os.matches) return;
      manual = !manual;
      document.documentElement.classList.toggle('reduce-motion',manual);
      try {localStorage.setItem('azharul-reduced-motion',String(manual));} catch (_) {}
      sync();fire();
    });
    os.addEventListener?.('change', () => {sync();fire();});
    sync();
  });
})();


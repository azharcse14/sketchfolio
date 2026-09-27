/* LinkedIn-inspired contextual navigation: down hides, a small upward
   gesture shows. The header remains in the layout (no content jump). */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.masthead');
    const menu = document.querySelector('#mobile-nav');
    const playMenu = document.querySelector('#play-tools-menu');
    if (!header) return;
    let previous = Math.max(0, window.scrollY);
    let direction = 0;
    let travelled = 0;
    let scheduled = false;

    function reveal() { header.classList.remove('nav-hidden'); }
    function sync() {
      scheduled = false;
      const current = Math.max(0, window.scrollY);
      const delta = current - previous;
      previous = current;
      if (current < 70 || !menu?.hidden || !playMenu?.hidden || (header.contains(document.activeElement) && document.activeElement?.matches(':focus-visible'))) {
        direction = 0; travelled = 0; reveal(); return;
      }
      // Avoid oscillation from tiny touchpad/wheel jitter.
      if (Math.abs(delta) < 1.3) return;
      const nextDirection = Math.sign(delta);
      if (nextDirection !== direction) { direction = nextDirection; travelled = 0; }
      travelled += Math.abs(delta);
      if (nextDirection > 0 && current > Math.max(125, header.offsetHeight + 25) && travelled > 19)
        header.classList.add('nav-hidden');
      else if (nextDirection < 0 && travelled > 7) reveal();
    }
    window.addEventListener('scroll', () => {
      if (!scheduled) { scheduled = true; requestAnimationFrame(sync); }
    }, {passive:true});
    header.addEventListener('focusin', reveal);
    // Keep the mobile menu and the theme button accessible when activated.
    document.querySelector('#nav-toggle')?.addEventListener('click', reveal);
    window.addEventListener('pageshow', () => { previous=Math.max(0,window.scrollY); reveal(); });
  });
})();


/* Simple discoverable access to the existing tools. No new backend or state. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded',()=>{
    const opener=document.querySelector('#play-tools-toggle');
    const menu=document.querySelector('#play-tools-menu');
    if(!opener||!menu)return;
    const close=()=>{menu.hidden=true;opener.setAttribute('aria-expanded','false')};
    opener.addEventListener('click',()=>{
      const opening=menu.hidden;
      menu.hidden=!opening;
      opener.setAttribute('aria-expanded',String(opening));
      document.querySelector('.masthead')?.classList.remove('nav-hidden');
    });
    document.addEventListener('click',event=>{if(!event.target.closest('.play-tools-wrap'))close()});
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&!menu.hidden){close();opener.focus()}
    });
    menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
    const activate=(href)=>{
      const target=document.getElementById(href==='#terminal-zone'?'terminal-zone':'draw-zone');
      if(target){target.classList.remove('tools-arrival');void target.offsetWidth;target.classList.add('tools-arrival')}
      if(href==='#terminal-zone'){
        const terminal=document.querySelector('#secret-terminal');
        if(terminal?.hidden)document.querySelector('#terminal-toggle')?.click();
      }else if(href==='#draw-zone'){
        const canvas=document.querySelector('#page-drawing');
        if(canvas&&!canvas.classList.contains('is-active'))document.querySelector('#sketch-toggle')?.click();
      }
    };
    document.addEventListener('paperplane:arrived',event=>{
      if(event.detail?.href==='#terminal-zone'||event.detail?.href==='#draw-zone')activate(event.detail.href);
    });
    // Browser Back/Forward and direct links still reveal the selected tool.
    window.addEventListener('load',()=>{
      if(location.hash==='#terminal-zone'||location.hash==='#draw-zone'){
        requestAnimationFrame(()=>activate(location.hash));
      }
    });
  });
})();


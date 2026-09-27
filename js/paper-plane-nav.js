/* Hand-drawn paper-plane navigation. Local page links only; no external requests. */
(() => {
  'use strict';
  const prefersLessMotion = window.portfolioReducedMotion;
  let flight = null;

  const clamp = (n,min,max) => Math.min(Math.max(n,min),max);
  const easeInOut = t => t < .5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
  const mix = (a,b,t) => a + (b-a)*t;
  const cubic = (a,b,c,d,t) => {
    const u=1-t;
    return u*u*u*a + 3*u*u*t*b + 3*u*t*t*c + t*t*t*d;
  };
  const samePageLink = anchor => {
    if(!anchor || anchor.classList.contains('skip'))return null;
    const href=anchor.getAttribute('href');
    if(!href || !/^#[A-Za-z][\w-]*$/.test(href))return null;
    const element=document.getElementById(href.slice(1));
    return element ? {href, element} : null;
  };
  function moveFocus(element){
    const focusTarget=element.querySelector('h1,h2')||element;
    const added=!focusTarget.hasAttribute('tabindex');
    if(added)focusTarget.setAttribute('tabindex','-1');
    focusTarget.focus({preventScroll:true});
    if(added)focusTarget.addEventListener('blur',()=>focusTarget.removeAttribute('tabindex'),{once:true});
  }
  function goTo(href,element,scrollY){
    window.scrollTo({left:0,top:scrollY,behavior:'instant'});
    if(location.hash!==href)history.pushState(null,'',href);
    moveFocus(element);
    document.dispatchEvent(new CustomEvent('paperplane:arrived',{detail:{href}}));
  }
  function cancelFlight(){
    if(!flight)return;
    cancelAnimationFrame(flight.frame);
    flight.layer.remove();
    flight=null;
  }
  function launchPaperPlane(anchor,href,target){
    cancelFlight();
    const startRect=anchor.getBoundingClientRect();
    const width=innerWidth,height=innerHeight;
    const start={x:clamp(startRect.left+startRect.width/2,24,width-24),y:clamp(startRect.top+startRect.height/2,18,height-18)};
    const initialScroll=scrollY;
    const scrollLimit=Math.max(0,document.documentElement.scrollHeight-height);
    const endScroll=href==='#top'?0:clamp(initialScroll+target.getBoundingClientRect().top-34,0,scrollLimit);
    const heading=target.querySelector('h1,h2,.section-title');
    const headingRect=(heading||target).getBoundingClientRect();
    const incomingY=headingRect.top+initialScroll-endScroll;
    const returning=href==='#top' || endScroll < initialScroll-24;
    const end={
      x:href==='#top'?clamp(width*.46,65,width-65):clamp(headingRect.left + Math.min(headingRect.width*.38,165),65,width-65),
      y:href==='#top'?clamp(height*.20,100,210):clamp(incomingY+55,115,height*.55)
    };
    const xDir=start.x>width*.5?-1:1;
    const endDir=end.x>width*.5?-1:1;
    const cp1={x:clamp(start.x+xDir*width*.25,38,width-38),y:returning?height*.73:height*.31};
    const cp2={x:clamp(end.x+endDir*width*.29,38,width-38),y:returning?height*.12:height*.70};
    const curve=`M ${start.x.toFixed(1)} ${start.y.toFixed(1)} C ${cp1.x.toFixed(1)} ${cp1.y.toFixed(1)}, ${cp2.x.toFixed(1)} ${cp2.y.toFixed(1)}, ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;

    const layer=document.createElement('div');
    layer.className='paper-flight'+(returning?' is-returning':'');
    layer.setAttribute('aria-hidden','true');
    layer.innerHTML=`<svg class="paper-flight-path" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" fill="none" aria-hidden="true"><path class="paper-flight-ink" d="${curve}"/><path class="paper-flight-pencil" d="${curve}"/></svg><div class="paper-flight-plane"><svg viewBox="0 0 100 102" aria-hidden="true" fill="none" stroke-linejoin="round" stroke-linecap="round"><path class="paper-flight-wing" d="M50 6Q57 15 68 36L92 77 58 63 49 96 42 62 9 77 33 36Q41 18 50 6Z"/><path class="paper-flight-fold" d="M50 8 49 96M9 77Q30 47 50 8M92 77Q74 47 50 8M41 62l8 34 9-33"/><path class="paper-flight-scratch" d="M22 65 36 43m43 22-13-23"/></svg></div>`;
    document.body.append(layer);
    const path=layer.querySelector('.paper-flight-ink');
    const pencil=layer.querySelector('.paper-flight-pencil');
    const plane=layer.querySelector('.paper-flight-plane');
    const length=path.getTotalLength();
    path.style.strokeDasharray=String(length);
    path.style.strokeDashoffset=String(length);
    pencil.style.strokeDasharray=String(length);
    pencil.style.strokeDashoffset=String(length);
    const duration=clamp(1190+Math.abs(endScroll-initialScroll)*.075,1300,1680);
    let firstFrame=null;
    const state={layer,frame:0,href,target,endScroll}; flight=state;
    function draw(now){
      if(flight!==state)return;
      if(firstFrame===null)firstFrame=now;
      const t=clamp((now-firstFrame)/duration,0,1);
      const fly=easeInOut(t);
      const x=cubic(start.x,cp1.x,cp2.x,end.x,fly);
      const y=cubic(start.y,cp1.y,cp2.y,end.y,fly);
      const ahead=clamp(fly+.009,0,1);
      const xa=cubic(start.x,cp1.x,cp2.x,end.x,ahead);
      const ya=cubic(start.y,cp1.y,cp2.y,end.y,ahead);
      const angle=Math.atan2(ya-y,xa-x)*180/Math.PI+90;
      let scale;
      if(t<.38)scale=mix(1.14,.43,easeInOut(t/.38));
      else if(t<.72)scale=mix(.43,.64,(t-.38)/.34);
      else scale=mix(.64,2.65,easeInOut((t-.72)/.28));
      const alpha=t<.80?1:Math.max(0,1-(t-.80)/.20);
      plane.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%) rotate(${angle.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      plane.style.opacity=String(alpha);
      const dashOffset=length*(1-fly);
      path.style.strokeDashoffset=String(dashOffset);
      pencil.style.strokeDashoffset=String(Math.min(length,dashOffset+12));
      layer.style.setProperty('--flight-fade',String(t<.73?1:Math.max(0,1-(t-.73)/.27)));
      const scrollProgress=easeInOut(clamp((t-.04)/.90,0,1));
      window.scrollTo({top:mix(initialScroll,endScroll,scrollProgress),left:0,behavior:'instant'});
      if(t<1)state.frame=requestAnimationFrame(draw);
      else{
        window.scrollTo({top:endScroll,left:0,behavior:'instant'});
        layer.remove(); flight=null;
        if(location.hash!==href)history.pushState(null,'',href);
        moveFocus(target);
        document.dispatchEvent(new CustomEvent('paperplane:arrived',{detail:{href}}));
      }
    }
    state.frame=requestAnimationFrame(draw);
  }

  // Capture position before the mobile-menu handler closes its own menu.
  document.addEventListener('click',event=>{
    if(event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)return;
    const anchor=event.target.closest?.('a[href^="#"]');
    const destination=samePageLink(anchor);
    if(!destination)return;
    event.preventDefault();
    const {href,element}=destination;
    const targetScroll=href==='#top'?0:clamp(scrollY+element.getBoundingClientRect().top-34,0,Math.max(0,document.documentElement.scrollHeight-innerHeight));
    if(prefersLessMotion.matches){cancelFlight();goTo(href,element,targetScroll);return;}
    launchPaperPlane(anchor,href,element);
  },true);

  // A visitor's next gesture wins over decorative flight. Repeated nav clicks
  // already replace an in-progress flight using its live scroll position.
  window.addEventListener('wheel',event=>{if(flight && Math.abs(event.deltaY)>3)cancelFlight();},{passive:true});
  window.addEventListener('touchmove',()=>{if(flight)cancelFlight();},{passive:true});
  window.addEventListener('keydown',event=>{
    if(flight && ['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key)
       && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) cancelFlight();
  });
  window.addEventListener('portfolio:motionchange',()=>{
    if(prefersLessMotion.matches && flight){
      const {href,target,endScroll}=flight;
      cancelFlight();goTo(href,target,endScroll);
    }
  });
  window.addEventListener('pagehide',cancelFlight);
  window.addEventListener('popstate',()=>{
    cancelFlight();
    const target=document.getElementById(location.hash.slice(1)||'top');
    if(target){const pos=location.hash==='#top'||!location.hash?0:scrollY+target.getBoundingClientRect().top-34;window.scrollTo({top:pos,behavior:'instant'});}
  });
})();


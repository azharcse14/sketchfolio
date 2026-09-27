(() => {
  'use strict';
  const $=(q,root=document)=>root.querySelector(q);
  const $$=(q,root=document)=>Array.from(root.querySelectorAll(q));
  const paint=(el,text)=>window.PenLetters.paint(el,text);
  function storeGet(key){try{return localStorage.getItem(key)}catch{return null}}
  function storeSet(key,val){try{localStorage.setItem(key,val)}catch{}}
  document.addEventListener('DOMContentLoaded',()=>{
    let toastTimeout;
    const toast=(message)=>{const el=$('#toast');paint(el,message);el.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('show'),2600);};
    // The button reflects the CURRENT sky. Switching themes plays a full-viewport
    // hand-drawn sunset / moonrise; the arriving celestial body settles into the button.
    const themeToggle=$('#theme-toggle');
    const sky=$('#sky-transition');
    const themeMeta=$('meta[name="theme-color"]');
    const reduceMotion=window.portfolioReducedMotion;
    let skyRunning=false;
    const syncTheme=()=>{
      const dark=document.body.classList.contains('dark');
      themeToggle.setAttribute('aria-label', dark?'Switch to light mode':'Switch to dark mode');
      themeToggle.setAttribute('aria-pressed', String(dark));
      themeToggle.title=dark?'Let the sun rise':'Let the sun set';
      themeMeta?.setAttribute('content',dark?'#202a29':'#f5f0e5');
    };
    if(storeGet('handpaper-theme')==='dark')document.body.classList.add('dark');
    syncTheme();
    themeToggle.addEventListener('click',()=>{
      if(skyRunning)return;
      const toDark=!document.body.classList.contains('dark');
      const rect=themeToggle.getBoundingClientRect();
      const x=rect.left+rect.width/2, y=rect.top+rect.height/2;
      // Reduced-motion visitors get an immediate accessible icon/theme update.
      if(reduceMotion.matches || !Element.prototype.animate){
        document.body.classList.toggle('dark',toDark);
        storeSet('handpaper-theme',toDark?'dark':'light');syncTheme();return;
      }
      skyRunning=true;themeToggle.disabled=true;
      sky.dataset.to=toDark?'dark':'light';sky.hidden=false;
      const width=innerWidth, height=innerHeight, maxRadius=Math.hypot(Math.max(x,width-x),Math.max(y,height-y))+120;
      const incoming=$('.sky-wash',sky);
      const sun=$('#sky-sun'),moon=$('#sky-moon');
      sun.style.opacity='0';moon.style.opacity='0';
      document.body.classList.toggle('dark',toDark);
      storeSet('handpaper-theme',toDark?'dark':'light');syncTheme();
      const duration=1900;
      incoming.animate([
        {clipPath:`circle(0px at ${x}px ${y}px)`,opacity:.85,offset:0},
        {clipPath:`circle(${Math.round(maxRadius*.62)}px at ${x}px ${y}px)`,opacity:1,offset:.65},
        {clipPath:`circle(${Math.ceil(maxRadius)}px at ${x}px ${y}px)`,opacity:1,offset:1}
      ],{duration:1570,easing:'cubic-bezier(.36,.03,.19,1)',fill:'forwards'});
      const setting=toDark?sun:moon, rising=toDark?moon:sun;
      // SVGs are 144px square. The midpoint expands to a larger-than-life sky drawing.
      const at=(px,py,scale,rotation=0)=>`translate(${Math.round(px-72)}px, ${Math.round(py-72)}px) scale(${scale}) rotate(${rotation}deg)`;
      setting.animate([
        {transform:at(x,y,.25,-10),opacity:1,offset:0},
        {transform:at(width*.48,height*.40,3.25,13),opacity:1,offset:.43},
        {transform:at(width*.46,height*.84,2.5,21),opacity:.95,offset:.70},
        {transform:at(width*.42,height+220,1.75,34),opacity:0,offset:1}
      ],{duration:1650,easing:'cubic-bezier(.43,.01,.3,1)',fill:'both'});
      rising.animate([
        {transform:at(width*.69,height+195,.5,-20),opacity:0,offset:0},
        {transform:at(width*.70,height*.57,2.85,-7),opacity:1,offset:.55},
        {transform:at(width*.74,height*.25,1.42,6),opacity:1,offset:.76},
        {transform:at(x,y,.24,0),opacity:1,offset:1}
      ],{duration:1750,easing:'cubic-bezier(.21,.4,.24,1)',fill:'both'});
      const stars=$('.sky-stars',sky),horizon=$('.sky-horizon',sky);
      stars.animate([{opacity:0,transform:'translateY(28px)'},{opacity:toDark?.9:.2,transform:'translateY(-5px)'},{opacity:toDark?.72:0,transform:'translateY(0)'}],{duration:1600,fill:'both'});
      horizon.animate([{opacity:0,transform:'translateY(80px)'},{opacity:.5,transform:'translateY(0)'},{opacity:0,transform:'translateY(60px)'}],{duration:1650,fill:'both'});
      sky.animate([{opacity:1,offset:0},{opacity:1,offset:.82},{opacity:0,offset:1}],{duration,easing:'ease-in-out',fill:'both'}).finished
        .catch(()=>{}).finally(()=>{
          sky.hidden=true;
          // Animations belong to the temporary sky, not the static navigation icon.
          sky.getAnimations({subtree:true}).forEach(anim=>anim.cancel());
          skyRunning=false;themeToggle.disabled=false;
        });
    });
    window.addEventListener('portfolio:motionchange',()=>{
      if(reduceMotion.matches && skyRunning){
        sky.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
        sky.hidden=true;skyRunning=false;themeToggle.disabled=false;
      }
    });
    const menu=$('#mobile-nav'),menuBtn=$('#nav-toggle');
    function closeMenu(){menu.hidden=true;menuBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-label','Open navigation')}
    menuBtn.addEventListener('click',()=>{const opening=menu.hidden;menu.hidden=!opening;menuBtn.setAttribute('aria-expanded',String(opening));menuBtn.setAttribute('aria-label',opening?'Close navigation':'Open navigation')});
    $$('#mobile-nav a').forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden)closeMenu()});
    const statuses={android:'android sketch / interactive!',ios:'swift & native ios / interactive!',flutter:'flutter & dart / interactive!'};
    $$('.paper-tab').forEach(btn=>btn.addEventListener('click',()=>{const current=btn.dataset.build;$$('.paper-tab').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn))});paint($('#build-status'),statuses[current]);const paper=$('.hero-right');paper.classList.remove('jostle');void paper.offsetHeight;paper.classList.add('jostle');}));
    let love=0;const loveButton=$('#love-button');loveButton.addEventListener('click',()=>{love++;paint($('#love-count'),String(love));loveButton.classList.remove('pop');void loveButton.offsetWidth;loveButton.classList.add('pop');if(love===5)toast('five little hearts. thank you!');});
    const skills={
      android:['native android','kotlin, jetpack compose, carefully considered motion, and interfaces that feel at home on the device.'],
      ios:['native ios','swift, swiftui, and small details that make a phone feel like a familiar place.'],
      flutter:['flutter & dart','cross-platform experiments, custom widgets, smooth animations, and one codebase for two little worlds.'],
      go:['go services','fast, simple services, careful concurrency, well-documented apis and reliable deploys.'],
      rust:['rust basics + flutter ffi','i know rust basics and have connected rust with flutter through ffi. i would like to explore rust much more in future projects.'],
      sql:['sql','questions turned into queries, indexes that matter, and data models that make sense.'],
      postgres:['postgresql','solid schemas, relationships, indexes, transactions and thoughtful query plans.'],
      sqlite:['sqlite','lightweight local storage, offline-first ideas and small databases that punch above their weight.']
    };
    $$('.skill').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.skill;$$('.skill').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});paint($('#skill-name'),skills[key][0]);paint($('#skill-description'),skills[key][1]);}));
    $('#skill-next').addEventListener('click',()=>{const cards=$$('.skill');const active=cards.findIndex(card=>card.classList.contains('active'));cards[(active+1)%cards.length].click();});
    $$('.filter-button').forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.filter;$$('.filter-button').forEach(b=>{b.classList.toggle('chosen',b===button);b.setAttribute('aria-pressed',String(b===button))});$$('.project-card').forEach(card=>{card.hidden=filter!=='all'&&!card.dataset.tags.split(' ').includes(filter)});toast(filter==='all'?'all sketchbook pages':`${filter} pages only`);}));
    const projects={
      pocket:['flutter meets rust','a learning experiment: i used basic rust with flutter through ffi. this page is an outline, not a claim of a production rust app.'],
      service:['the api workshop','a sample go service. replace it with your actual endpoints, architecture, testing, and tradeoffs.'],
      query:['query garden','a sample database case study. replace it with your real postgresql or sqlite schemas, migrations, indexing and query improvements.']
    };
    const dialog=$('#project-dialog');$$('[data-open]').forEach(button=>button.addEventListener('click',()=>{const item=projects[button.dataset.open];paint($('#dialog-title'),item[0]);paint($('#dialog-description'),item[1]);const badge=$('#dialog-badge');if(badge)paint(badge,button.dataset.open==='pocket'?'real learning experiment / rust basics':'sample concept / replace with verified work');if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','');}));
    const closeDialog=()=>dialog.close?dialog.close():dialog.removeAttribute('open');$('#modal-close').addEventListener('click',closeDialog);$('#dialog-done').addEventListener('click',closeDialog);dialog.addEventListener('click',e=>{if(e.target===dialog)closeDialog()});
    $('#copy-email').addEventListener('click',async()=>{const profile='https://www.linkedin.com/in/azharcse/';try{await navigator.clipboard.writeText(profile);toast('linkedin link copied!')}catch{toast('copy this: '+profile)}});

    // This input itself uses a simple fallback for editability; preview uses the actual glyph paths.
    const noteInput=$('#write-input'),live=$('#live-handwriting');
    noteInput.addEventListener('input',()=>{let el=live.querySelector('[data-ink]');if(!el){el=document.createElement('span');el.className='ink';live.append(el)}paint(el,noteInput.value||'hello from my sketchbook');});

    // The pad uses actual pointer samples with a slight graphite second-pass.
    const canvas=$('#scribble-pad'),ctx=canvas.getContext('2d');let color='#344039',painting=false,last=null;
    function resizePad(){const old=canvas.width>0?document.createElement('canvas'):null;if(old){old.width=canvas.width;old.height=canvas.height;old.getContext('2d').drawImage(canvas,0,0)}const r=canvas.getBoundingClientRect();const ratio=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(r.width*ratio));canvas.height=Math.max(1,Math.round(r.height*ratio));ctx.setTransform(ratio,0,0,ratio,0,0);if(old)ctx.drawImage(old,0,0,old.width,old.height,0,0,r.width,r.height);}
    requestAnimationFrame(resizePad);
    window.addEventListener('resize',()=>{if(canvas.getBoundingClientRect().width)resizePad()});
    function point(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
    canvas.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType==='mouse')return;canvas.setPointerCapture(e.pointerId);painting=true;last=point(e);ctx.fillStyle=color;ctx.beginPath();ctx.arc(last.x,last.y,1.5,0,Math.PI*2);ctx.fill();});
    canvas.addEventListener('pointermove',e=>{if(!painting||!last)return;const p=point(e),d=Math.hypot(p.x-last.x,p.y-last.y);const mid={x:(p.x+last.x)/2,y:(p.y+last.y)/2};ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle=color;ctx.lineWidth=Math.max(1.1,2.5-Math.min(d/21,1.15));ctx.globalAlpha=.85;ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.quadraticCurveTo(last.x+.1,last.y-.3,mid.x,mid.y);ctx.stroke();ctx.globalAlpha=.1;ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(last.x+.6,last.y-.8);ctx.lineTo(p.x+.6,p.y-.8);ctx.stroke();ctx.globalAlpha=1;last=mid;});
    function endStroke(){painting=false;last=null;ctx.globalAlpha=1}canvas.addEventListener('pointerup',endStroke);canvas.addEventListener('pointercancel',endStroke);canvas.addEventListener('lostpointercapture',endStroke);
    $$('.color-dot').forEach(btn=>btn.addEventListener('click',()=>{color=btn.dataset.color;$$('.color-dot').forEach(b=>{b.classList.toggle('selected',b===btn);b.setAttribute('aria-pressed',String(b===btn))})}));
    $('#clear-sketch').addEventListener('click',()=>{ctx.clearRect(0,0,canvas.width,canvas.height);toast('fresh sheet. draw again!')});
    // A personal handwritten LETTER for each visitor, never changes the owner's logo.
    const visitorOpen=$('#visitor-open'),visitorEditor=$('#visitor-editor');
    const visitorLetter=$('#visitor-letter'),visitorName=$('#visitor-name');
    function showLetter(name,animated=false){
      visitorEditor.hidden=true;visitorOpen.setAttribute('aria-expanded','false');
      visitorLetter.hidden=false;
      window.PenLetters.paint($('#visitor-greeting'),`dear ${name},`,{animate:animated,startDelay:120});
      if(animated){
        $$('.visitor-letter .visitor-line:not(#visitor-greeting),.visitor-letter .visitor-sign')
          .forEach((el,i)=>window.PenLetters.paint(el,el.getAttribute('data-ink'),{animate:true,startDelay:450+i*480}));
        visitorLetter.classList.remove('letter-arrived');
        void visitorLetter.offsetWidth;
        visitorLetter.classList.add('letter-arrived');
      }
      visitorOpen.classList.add('has-letter');
    }
    const savedVisitor=storeGet('handpaper-visitor');
    if(savedVisitor&&/^[a-zA-Z][a-zA-Z .'-]{0,23}$/.test(savedVisitor)){
      visitorName.value=savedVisitor;showLetter(savedVisitor);
    }
    visitorOpen.addEventListener('click',()=>{
      const opening=visitorEditor.hidden;
      visitorEditor.hidden=!opening;
      visitorOpen.setAttribute('aria-expanded',String(opening));
      if(opening){visitorLetter.hidden=true;visitorName.focus()}
      else if(storeGet('handpaper-visitor'))visitorLetter.hidden=false;
    });
    visitorEditor.addEventListener('submit',event=>{
      event.preventDefault();
      const name=visitorName.value.trim().replace(/\s+/g,' ');
      if(!/^[a-zA-Z][a-zA-Z .'-]{0,23}$/.test(name)){
        visitorName.setCustomValidity('Please use English letters for your name.');
        visitorName.reportValidity();return;
      }
      visitorName.setCustomValidity('');
      storeSet('handpaper-visitor',name);showLetter(name,true);
    });
    visitorName.addEventListener('input',()=>visitorName.setCustomValidity(''));
    $('#visitor-again').addEventListener('click',()=>{
      visitorLetter.hidden=true;visitorEditor.hidden=false;
      visitorOpen.setAttribute('aria-expanded','true');visitorName.select();
    });
  });
})();

// Hand-sketched portrait viewer (dialog focus handling is native).
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('portrait-dialog');
    const art = document.getElementById('portrait-dialog-image');
    const caption = document.getElementById('portrait-dialog-caption');
    const close = document.getElementById('portrait-dialog-close');
    if (!modal || !art || !caption || !close) return;
    let previousFocus;
    document.querySelectorAll('[data-portrait]').forEach(button => button.addEventListener('click', () => {
      previousFocus = button;
      const formal = button.dataset.portrait === 'formal';
      art.src = formal ? 'assets/azhar-formal-sketch.webp' : 'assets/azhar-main-sketch.webp';
      art.alt = formal ? 'Larger formal pencil portrait of Azharul Islam in a suit and tie' : 'Larger pencil portrait of Azharul Islam in a black blazer';
      const phrase = formal ? 'the formal me.' : 'azharul, in pencil.';
      if (window.PenLetters) window.PenLetters.paint(caption, phrase);
      else caption.textContent = phrase;
      modal.showModal();
      close.focus();
    }));
    close.addEventListener('click', () => modal.close());
    modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
    modal.addEventListener('close', () => { previousFocus?.focus(); });
  });
})();


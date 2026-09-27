/* Interactive extras for the paper portfolio.
   No dependencies, remote endpoints, analytics or backend claims. */
(() => {
  'use strict';
  const $ = (q, root=document) => root.querySelector(q);
  const $$ = (q, root=document) => [...root.querySelectorAll(q)];
  const write = (el, value, options={}) => window.PenLetters.paint(el, String(value), options);
  const safeStore = (key, data) => { try {localStorage.setItem(key, JSON.stringify(data));} catch (_) {} };
  const safeRead = (key, fallback) => { try {return JSON.parse(localStorage.getItem(key)) ?? fallback;} catch (_) {return fallback;} };

  document.addEventListener('DOMContentLoaded', () => {
    // 1 — The existing letters are real hand-made SVG glyphs. A pen travels
    // alongside the headline during replay instead of faking a typewriter.
    const hero = $('#hero-title');
    const pen = document.createElement('span');
    pen.className = 'hero-scribble-pen';
    pen.setAttribute('aria-hidden','true');
    pen.innerHTML = '<svg viewBox="0 0 48 48" fill="none"><path d="M5 36 30 3q8-5 13 5L20 40 5 45zM14 26l13 11M5 45l10-19M38 12l6 3"/></svg>';
    hero.append(pen);
    let replayHandle;
    const replay = (doLetters=true) => {
      if (doLetters) $$('.headline', hero).forEach((el,index) => write(el, el.getAttribute('data-ink'), {animate:true,startDelay:index*550}));
      hero.classList.remove('is-replaying');
      void hero.offsetWidth;
      hero.classList.add('is-replaying');
      window.clearTimeout(replayHandle);
      replayHandle = window.setTimeout(() => hero.classList.remove('is-replaying'), 2800);
    };
    $('#replay-writing').addEventListener('click',() => replay());
    if (!window.portfolioReducedMotion.matches) replay(false);

    // 2 — Open each project as three honest, editable *sample* case-study pages.
    const details = {
      pocket: {
        problem:'i wanted to explore how flutter and a native rust library can communicate. this was a learning exercise, not a shipped rust product.',
        solution:'i have used rust basics with flutter through ffi. i want to keep learning rust and explore more practical integrations.',
        flow:['flutter / dart','dart ffi bridge','rust library']
      },
      service: {
        problem:'picture a service that needs clear endpoints, predictable errors, and space to grow without getting tangled.',
        solution:'shape a small, well-tested http api. split handlers and domain logic, validate inputs, and keep logs useful.',
        flow:['client request','go api / sample','postgresql']
      },
      query: {
        problem:'sample data is getting bigger. some questions take longer and relationships are starting to get confusing.',
        solution:'start with a sensible schema. inspect query plans, add purposeful indexes, and keep migrations reversible.',
        flow:['questions','sql + indexes','postgres / sqlite']
      }
    };
    let selectedProject = 'pocket', selectedPage = 'problem';
    const caseArea = $('#case-content');
    const renderCase = () => {
      const item = details[selectedProject] || details.pocket;
      $$('.case-tab').forEach(btn => {
        const active = btn.dataset.caseTab === selectedPage;
        btn.classList.toggle('selected', active);
        btn.setAttribute('aria-selected', String(active));
        btn.tabIndex = active ? 0 : -1;
      });
      caseArea.replaceChildren();
      const label = document.createElement('div');
      label.className='case-label ink';
      write(label,selectedPage === 'architecture' ? (selectedProject === 'pocket' ? 'ffi bridge / simplified sketch' : 'rough architecture / example') : `${selectedPage} / ${selectedProject === 'pocket' ? 'learning notes' : 'sample notes'}`);
      caseArea.append(label);
      if(selectedPage === 'architecture') {
        const description = document.createElement('p');
        description.className='ink-para';
        write(description, selectedProject === 'pocket' ? 'a simplified picture of flutter and rust communicating through ffi. the exact implementation details are left open.' : 'a little napkin diagram for an imaginary project. swap each box with your actual components.');
        caseArea.append(description);
        const flow = document.createElement('div');
        flow.className='case-arch';
        item.flow.forEach((name,index) => {
          if(index) {
            const arrow=document.createElement('span');
            arrow.className='case-arch-arrow';
            arrow.textContent='↝';arrow.setAttribute('aria-hidden','true');flow.append(arrow);
          }
          const node=document.createElement('span');node.className='case-arch-card ink';write(node,name);flow.append(node);
        });
        caseArea.append(flow);
      } else {
        const para=document.createElement('p');para.className='ink-para';write(para,item[selectedPage]);caseArea.append(para);
      }
    };
    $$('[data-open]').forEach(btn => btn.addEventListener('click',() => {
      selectedProject = btn.dataset.open;
      selectedPage='problem';
      renderCase();
    }));
    $$('.case-tab').forEach(btn => btn.addEventListener('click',() => {selectedPage=btn.dataset.caseTab;renderCase();}));
    $('.case-tabs').addEventListener('keydown', e => {
      if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) return;
      const buttons=$$('.case-tab');
      const index=buttons.findIndex(b=>b.dataset.caseTab===selectedPage);
      const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(index+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
      buttons[next].click();buttons[next].focus();e.preventDefault();
    });

    // 3 — Three distinct phone moods with *real* clickable in-phone UI.
    const phones = {
      android:{caption:'android / material-inspired sketch',eyebrow:'hello, android friend!',heading:'little stays',tag:'made for the moment'},
      ios:{caption:'ios / a little swift magic',eyebrow:'good morning, ios!',heading:'little escapes',tag:'small things, lovely details'},
      flutter:{caption:'flutter / two homes, one idea',eyebrow:'hello from flutter!',heading:'little worlds',tag:'one idea, many screens'}
    };
    let platform='android', screen='explore', favorite=false;
    const renderPhone=() => {
      const config=phones[platform];
      $('#playphone').dataset.currentPlatform=platform;
      $$('.platform-pill').forEach(btn => {
        const chosen=btn.dataset.platform===platform;
        btn.classList.toggle('selected',chosen);
        btn.setAttribute('aria-pressed',String(chosen));
      });
      $$('.app-nav-item').forEach(btn => {
        const chosen=btn.dataset.screen===screen;
        btn.classList.toggle('current',chosen);
        btn.setAttribute('aria-pressed',String(chosen));
      });
      write($('#phone-caption'), config.caption);
      write($('#app-eyebrow'),config.eyebrow);
      write($('#app-heading'),screen==='explore'?config.heading:screen==='saved'?'my little saves':'hello, builder!');
      write($('#app-card-tag'),screen==='explore'?config.tag:screen==='saved'?'your little corner':'under construction');
      write($('#app-card-title'),screen==='explore'?'the sunny cabin':screen==='saved'?(favorite?'the sunny cabin':'no saves... yet!'):'your little profile');
      write($('#app-subnote .ink'),screen==='explore'?'try the heart. then visit saved.':screen==='saved'?(favorite?'hooray! your first favorite.':'go explore, then tap a heart!'):'a tiny profile, drawn in pencil.');
      const heart=$('#app-favorite');
      heart.classList.toggle('is-saved',favorite);
      heart.setAttribute('aria-pressed',String(favorite));
      heart.setAttribute('aria-label',favorite?'Remove saved sample stay':'Save sample stay');
      heart.disabled=screen==='profile';
      heart.hidden=screen==='profile';
      $('#app-panel').classList.toggle('empty-saved',screen==='saved'&&!favorite);
    };
    $$('.platform-pill').forEach(btn=>btn.addEventListener('click',()=>{platform=btn.dataset.platform;renderPhone();}));
    $$('.app-nav-item').forEach(btn=>btn.addEventListener('click',()=>{screen=btn.dataset.screen;renderPhone();}));
    $('#app-favorite').addEventListener('click',()=>{favorite=!favorite;renderPhone();$('#app-favorite').classList.remove('heart-beat');void $('#app-favorite').offsetWidth;$('#app-favorite').classList.add('heart-beat');});
    renderPhone();

    // 4 — Explicitly simulated responses. No requests leave the browser.
    let route='projects', requests=0;
    const exampleResponses={
      projects: () => ({sample:true, projects:[{id:1,name:'pocket notes',stack:['flutter','sqlite']},{id:2,name:'the api workshop',stack:['go','postgresql']}]}),
      skills: () => ({sample:true, mobile:['android','ios','flutter'], backend:['go','rust basics / flutter ffi'], data:['postgresql','sqlite']})
    };
    const response=$('#api-response'), input=$('#api-note-input'), send=$('#api-send');
    response.setAttribute('aria-live','polite');
    const chooseRoute = name => {
      route=name;
      $$('.endpoint').forEach(btn=>{const selected=btn.dataset.endpoint===route;btn.classList.toggle('selected',selected);btn.setAttribute('aria-pressed',String(selected));});
      input.disabled=route!=='notes';
      write($('#api-hint'),route==='notes'?'type a tiny note, then send':'try a different route, then send again');
    };
    $$('.endpoint').forEach(btn=>btn.addEventListener('click',()=>chooseRoute(btn.dataset.endpoint)));
    let timer;
    const sendRequest = () => {
      requests++;
      const requestedRoute=route;
      send.disabled=true;$$('.endpoint').forEach(b=>b.disabled=true);
      write($('#api-status'),'sending...');write($('#api-timing'),'local only');
      response.firstElementChild.textContent='// doodling your response...';
      clearTimeout(timer);
      timer=setTimeout(()=>{
        let result, status='200 ok';
        if(requestedRoute==='notes') {
          const note=input.value.trim();
          if(!note){status='422 input needed';result={sample:true,error:'please write a tiny note first'};}
          else{status='201 created';result={sample:true,id:requests,text:note,saved:'in memory only'};}
        }else result=exampleResponses[requestedRoute]();
        write($('#api-status'),status);
        $('#api-status').classList.toggle('is-error',status.startsWith('422'));
        write($('#api-timing'),'~280 ms / simulated');
        response.firstElementChild.textContent=JSON.stringify(result,null,2);
        send.disabled=false;$$('.endpoint').forEach(b=>b.disabled=false);
      },280);
    };
    send.addEventListener('click',sendRequest);
    input.addEventListener('keydown', e=>{if(e.key==='Enter'&&!send.disabled&&route==='notes')sendRequest();});
    $('#api-reset').addEventListener('click',()=>{
      clearTimeout(timer);requests=0;send.disabled=false;$$('.endpoint').forEach(b=>b.disabled=false);chooseRoute('projects');input.value='ship something lovely';
      $('#api-status').classList.remove('is-error');write($('#api-status'),'200 ok');write($('#api-timing'),'not sent');
      response.firstElementChild.textContent='{\n  "message": "press send request",\n  "demo": true\n}';
    });
    chooseRoute('projects');

    // 6 — A lightweight sketch layer, toggleable so ordinary page navigation
    // remains usable. Eraser and Undo reconstruct strokes, not image guesses.
    const toggle=$('#sketch-toggle'), toolbar=$('#sketch-toolbar'), canvas=$('#page-drawing');
    // Return the button to the drawing section once sketch mode is closed.
    // In active mode the button is portaled to <body> above the full-screen canvas.
    const toggleHome=toggle.parentNode, toggleNextSibling=toggle.nextSibling;
    const ctx=canvas.getContext('2d');
    const notesLayer=$('#sticky-note-layer');notesLayer.hidden=true;
    let active=false, tool='pen', strokes=[], currentStroke=null;
    let cw=window.innerWidth,ch=window.innerHeight;
    const colors={pen:getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#344039',erase:'#000'};
    const strokeColor=()=>getComputedStyle(document.body).getPropertyValue('--ink').trim()||colors.pen;
    const paintStroke = (stroke) => {
      if(!stroke.points.length) return;
      const points=stroke.points.map(([x,y])=>[x*cw,y*ch]);
      ctx.save();
      ctx.globalCompositeOperation=stroke.tool==='erase'?'destination-out':'source-over';
      ctx.strokeStyle=stroke.color;ctx.fillStyle=stroke.color;
      ctx.lineWidth=stroke.tool==='erase'?28:2.6;ctx.lineJoin='round';ctx.lineCap='round';
      if(points.length===1){ctx.beginPath();ctx.arc(points[0][0],points[0][1],stroke.tool==='erase'?14:1.4,0,Math.PI*2);ctx.fill();}
      else{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];ctx.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2)}ctx.lineTo(...points.at(-1));ctx.stroke();}
      ctx.restore();
    };
    const redraw=()=>{ctx.clearRect(0,0,cw,ch);strokes.forEach(paintStroke);if(currentStroke)paintStroke(currentStroke);};
    const resize=()=>{cw=Math.max(1,innerWidth);ch=Math.max(1,innerHeight);const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(cw*dpr);canvas.height=Math.round(ch*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);redraw();};
    resize();window.addEventListener('resize',resize,{passive:true});
    const setActive = yes => {
      if(yes)document.body.appendChild(toggle);
      else toggleHome.insertBefore(toggle,toggleNextSibling);
      active=yes;canvas.classList.toggle('is-active',yes);toggle.classList.toggle('is-active',yes);
      toggle.setAttribute('aria-pressed',String(yes));toggle.setAttribute('aria-expanded',String(yes));
      toggle.setAttribute('aria-label',yes?'Turn off sketch-on-page mode':'Turn on sketch-on-page mode');
      write(toggle.querySelector('[data-ink]'),yes?'close sketch mode':'draw on page');
      toolbar.hidden=!yes;notesLayer.hidden=!yes;
      canvas.setAttribute('aria-hidden',String(!yes));
      canvas.setAttribute('aria-label','Drawing canvas: use your mouse or touch to draw. Sketches disappear on reload.');
      redraw();
      if(yes) toolbar.querySelector('[data-page-tool="pen"]')?.focus({preventScroll:true});
      else toggle.focus({preventScroll:true});
    };
    toggle.addEventListener('click',()=>setActive(!active));
    $('#sketch-done').addEventListener('click',()=>setActive(false));
    $$('.sketch-tool[data-page-tool]').forEach(btn=>btn.addEventListener('click',()=>{tool=btn.dataset.pageTool;$$('.sketch-tool[data-page-tool]').forEach(b=>{const chosen=b===btn;b.classList.toggle('selected',chosen);b.setAttribute('aria-pressed',String(chosen));});canvas.style.cursor=tool==='erase'?'cell':'crosshair';}));
    const getPoint=e=>[Math.max(0,Math.min(1,e.clientX/cw)),Math.max(0,Math.min(1,e.clientY/ch))];
    canvas.addEventListener('pointerdown',e=>{
      if(!active||(e.pointerType==='mouse'&&e.button!==0))return;
      canvas.setPointerCapture(e.pointerId);
      currentStroke={tool,color:strokeColor(),points:[getPoint(e)]};redraw();
    });
    canvas.addEventListener('pointermove',e=>{if(!currentStroke)return;currentStroke.points.push(getPoint(e));redraw();});
    const end=()=>{if(currentStroke){strokes.push(currentStroke);currentStroke=null;redraw();}};
    canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',end);
    $('#sketch-undo').addEventListener('click',()=>{strokes.pop();redraw();});
    $('#sketch-clear').addEventListener('click',()=>{strokes=[];redraw();});

    // Local-only draggable sticky notes. Saved only to this browser.
    const notesKey='paper-portfolio-sticky-v2';
    let noteData=safeRead(notesKey,[]);if(!Array.isArray(noteData))noteData=[];
    const saveNotes=()=>safeStore(notesKey,noteData);
    const place=(element,note)=>{element.style.left=`${Math.max(8,Math.min(note.x,innerWidth-element.offsetWidth-8))}px`;element.style.top=`${Math.max(8,Math.min(note.y,innerHeight-element.offsetHeight-8))}px`;};
    const addNote=(item,focus=false)=>{
      const shell=document.createElement('section');shell.className='sticky-note';
      shell.setAttribute('aria-label','Movable sticky note');
      const head=document.createElement('div');head.className='sticky-note-head';
      const title=document.createElement('span');title.className='ink';write(title,'little sticky note');
      const remove=document.createElement('button');remove.type='button';remove.className='sticky-note-close';remove.textContent='×';remove.setAttribute('aria-label','Delete sticky note');
      head.append(title,remove);
      const body=document.createElement('div');body.className='sticky-note-body';body.contentEditable='true';body.role='textbox';body.setAttribute('aria-label','Your note');body.setAttribute('aria-multiline','true');body.textContent=item.text;
      shell.append(head,body);notesLayer.append(shell);place(shell,item);
      body.addEventListener('input',()=>{item.text=body.innerText.slice(0,500);saveNotes();});
      remove.addEventListener('click',()=>{noteData=noteData.filter(n=>n.id!==item.id);shell.remove();saveNotes();});
      let origin=null;
      head.addEventListener('pointerdown',e=>{if(e.target===remove||e.button!==0)return;origin={x:e.clientX,y:e.clientY,px:parseFloat(shell.style.left),py:parseFloat(shell.style.top)};head.setPointerCapture(e.pointerId);shell.classList.add('is-active-note');e.preventDefault();});
      head.addEventListener('pointermove',e=>{if(!origin)return;item.x=Math.max(8,Math.min(innerWidth-shell.offsetWidth-8,origin.px+e.clientX-origin.x));item.y=Math.max(8,Math.min(innerHeight-shell.offsetHeight-8,origin.py+e.clientY-origin.y));place(shell,item);});
      const finish=()=>{if(origin){origin=null;saveNotes();shell.classList.remove('is-active-note');}};
      head.addEventListener('pointerup',finish);head.addEventListener('pointercancel',finish);head.addEventListener('lostpointercapture',finish);
      if(focus)body.focus();
    };
    noteData.slice(0,8).forEach(note=>addNote(note));
    $('#sketch-sticky').addEventListener('click',()=>{
      if(noteData.length>=8)return;
      const item={id:Date.now()+'-'+noteData.length,x:Math.min(innerWidth-210,95+noteData.length*24),y:Math.min(innerHeight-180,95+noteData.length*22),text:''};
      noteData.push(item);saveNotes();addNote(item,true);
    });
    window.addEventListener('keydown',e=>{if(e.key==='Escape'&&active){if(document.activeElement?.isContentEditable)return;setActive(false);}});
  });
})();


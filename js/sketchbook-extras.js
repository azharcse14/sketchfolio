/* Extra sketchbook interactions. No analytics, no uploads, no arbitrary eval. */
(()=>{
  'use strict';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const letter=(el,value,opts)=>{if(window.PenLetters?.paint)window.PenLetters.paint(el,String(value),opts);else el.textContent=String(value)};
  const reduced=window.portfolioReducedMotion;
  document.addEventListener('DOMContentLoaded',()=>{
    // Revealing original user photos (on keyboard/touch as well as CSS hover).
    $$('[data-reveal]').forEach(btn=>btn.addEventListener('click',()=>{
      const stack=$(`.portrait-stack[data-kind="${btn.dataset.reveal}"]`);
      const active=stack.classList.toggle('show-original');
      btn.setAttribute('aria-pressed',String(active));
      letter(btn,active?'back to the sketch':'see real photo');
    }));
    const modal=$('#portrait-dialog'),art=$('#portrait-dialog-image'),modalToggle=$('#portrait-dialog-toggle');
    let portraitType='main', showOriginal=false, isHovering=false;
    const canHover=matchMedia('(hover:hover) and (pointer:fine)');
    const updatePortrait=()=>{
      const reveal=showOriginal||isHovering;
      const source=$(`.portrait-stack[data-kind="${portraitType}"] .portrait-${reveal?'original':'sketch'}`);
      if(source){art.src=source.src;art.alt=source.alt;}
      art.classList.toggle('photo-revealed',reveal);
      art.setAttribute('aria-label',reveal?'Original photo. Activate to switch back to the sketch':'Pencil sketch. Hover or activate to see the original photo');
      const buttonText=showOriginal?'show pencil sketch':'show original photo';
      if(modalToggle.dataset.mode!==buttonText){letter(modalToggle,buttonText);modalToggle.dataset.mode=buttonText;}
      modalToggle.setAttribute('aria-pressed',String(showOriginal));
    };
    $$('[data-portrait]').forEach(btn=>btn.addEventListener('click',()=>{
      portraitType=btn.dataset.portrait;showOriginal=false;isHovering=false;updatePortrait();
    }));
    // Hover previews are temporary. The button and keyboard/touch activation persist until toggled.
    art.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&canHover.matches){isHovering=true;updatePortrait();}});
    art.addEventListener('pointerleave',()=>{if(isHovering){isHovering=false;updatePortrait();}});
    const toggleOriginal=()=>{showOriginal=!showOriginal;updatePortrait();};
    modalToggle.addEventListener('click',toggleOriginal);
    art.addEventListener('click',e=>{if(e.detail!==0)toggleOriginal();});
    art.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleOriginal();}});
    modal.addEventListener('close',()=>{showOriginal=false;isHovering=false;art.classList.remove('photo-revealed')});

    // A page TURN for the existing accessible notebook tabs. Previous/next are real controls.
    const tabs=$$('.case-tab'),content=$('#case-content'),count=$('#case-count');
    const syncPages=()=>{
      const index=Math.max(0,tabs.findIndex(t=>t.getAttribute('aria-selected')==='true'));
      count.textContent=`${index+1} / ${tabs.length}`;
      $('#case-prev').disabled=index===0; $('#case-next').disabled=index===tabs.length-1;
      if(!reduced.matches){content.classList.remove('page-flipping');void content.offsetWidth;content.classList.add('page-flipping');}
    };
    tabs.forEach(tab=>tab.addEventListener('click',syncPages));
    $('#case-prev').addEventListener('click',()=>{const i=tabs.findIndex(t=>t.getAttribute('aria-selected')==='true');if(i>0)tabs[i-1].click();});
    $('#case-next').addEventListener('click',()=>{const i=tabs.findIndex(t=>t.getAttribute('aria-selected')==='true');if(i<tabs.length-1)tabs[i+1].click();});
    $$('[data-open]').forEach(b=>b.addEventListener('click',()=>{setTimeout(syncPages,0)}));
    syncPages();

    // Honest architectures: Go is conceptual; the Rust FFI case is user-reported practice.
    const modes={
      go:{label:'CONCEPTUAL GO API FLOW · not a specific shipped-system claim',steps:[
        ['Mobile client','The UI sends a request; this diagram shows a possible pattern, not a claimed production project.','phone'],
        ['Go API','An illustrative service receives the request, validates data and applies its own rules.','server'],
        ['PostgreSQL','A relational database can store and query structured data behind the API.','database']
      ]},
      ffi:{label:'FLUTTER + RUST FFI · simplified diagram of a real learning exercise',steps:[
        ['Flutter / Dart','I have worked with Flutter and wanted to explore calling Rust from Dart.','phone'],
        ['FFI bridge','Dart FFI provides a way to call compiled native Rust functions. This sketch omits implementation details.','bridge'],
        ['Rust / basic','I know basic Rust and have used it through Flutter FFI. I plan to learn more.','rust'],
        ['Result to UI','A returned value can flow back through the bridge to Flutter. This is a simplified representation.','reply']
      ]}
    };
    const drawings={
      phone:'<rect x="9" y="3" width="28" height="38" rx="5"/><path d="M13 10q9-3 20 0v24H13zM20 37h7"/>',
      server:'<path d="M3 8q23-5 42 0v13q-23 5-42 0zM3 24q23-5 42 0v13q-23 5-42 0zM12 15h2M12 31h2M26 15h12M26 31h12"/>',
      database:'<ellipse cx="24" cy="8" rx="20" ry="6"/><path d="M4 8v28q20 13 40 0V8M4 21q20 12 40 0M4 32q20 12 40 0"/>',
      bridge:'<path d="M6 9h38v29H6zM11 23h28M19 15l-8 8 8 8m12-16 8 8-8 8"/>',
      rust:'<path d="M24 3q21 0 21 22 0 21-21 21T3 25Q3 3 24 3zM14 14h20q9 3 4 12l-8 2 9 11M20 15v25"/>',
      reply:'<path d="M8 8h32v22H22L12 40V30H8zM15 19l8 7 13-13"/>'
    };
    let currentMode='go',currentStep=0,playback=[];
    const archNodes=$('#arch-nodes'),archKind=$('#arch-kind'),archSheet=$('.arch-sheet');
    const cancelPlayback=()=>{playback.forEach(clearTimeout);playback=[];archSheet.classList.remove('is-playing');$('#arch-play').disabled=false};
    const showStep=i=>{
      currentStep=i;const s=modes[currentMode].steps[i];
      $$('.arch-node').forEach((btn,n)=>{btn.classList.toggle('is-active',n===i);btn.setAttribute('aria-pressed',String(n===i))});
      letter($('#arch-detail-title'),s[0]);letter($('#arch-detail-text'),s[1]);
    };
    const drawArch=(mode)=>{
      cancelPlayback();currentMode=mode;archKind.textContent=modes[mode].label;archNodes.replaceChildren();
      $$('.arch-mode').forEach(btn=>{const selected=btn.dataset.archMode===mode;btn.classList.toggle('is-current',selected);btn.setAttribute('aria-pressed',String(selected))});
      modes[mode].steps.forEach((s,i)=>{
        if(i){const arrow=document.createElement('svg');arrow.setAttribute('viewBox','0 0 39 25');arrow.setAttribute('class','arch-arrow');arrow.setAttribute('aria-hidden','true');arrow.innerHTML='<path d="M2 13q18-7 34-1m-11-9 11 9-11 9"/>';archNodes.append(arrow)}
        const btn=document.createElement('button');btn.type='button';btn.className='arch-node';btn.setAttribute('aria-pressed','false');btn.innerHTML=`<svg viewBox="0 0 48 48" aria-hidden="true">${drawings[s[2]]}</svg><span></span>`;
        letter(btn.lastElementChild,s[0]);btn.addEventListener('click',()=>{cancelPlayback();showStep(i)});archNodes.append(btn);
      });showStep(0);
    };
    $$('.arch-mode').forEach(b=>b.addEventListener('click',()=>drawArch(b.dataset.archMode)));
    $('#arch-play').addEventListener('click',()=>{
      cancelPlayback();archSheet.classList.add('is-playing');$('#arch-play').disabled=true;showStep(0);
      if(reduced.matches){showStep(modes[currentMode].steps.length-1);cancelPlayback();return}
      modes[currentMode].steps.forEach((_,i)=>playback.push(setTimeout(()=>showStep(i),i*850)));
      playback.push(setTimeout(cancelPlayback,modes[currentMode].steps.length*850+350));
    });
    drawArch('go');

    // Tiny break; all phrases are original, not attributed quotations.
    const quotes=['First the sketch. Then the commit.','Small experiments make big ideas.','One more cup, one less mystery.','Draw the flow before you chase the bug.','Keep learning, keep shipping.'];
    let coffeeIndex=0;
    $('#coffee-more').addEventListener('click',()=>{letter($('#coffee-quote').firstElementChild,quotes[++coffeeIndex%quotes.length].toLowerCase())});

    // Folding letter is a DRAFT. User must copy and paste on LinkedIn to deliver it.
    let drafted='';
    const form=$('#letter-form'),envelope=$('#letter-envelope'),actions=$('#letter-actions');
    form.addEventListener('submit',e=>{
      e.preventDefault();const who=$('#letter-name').value.trim().replace(/\s+/g,' '),body=$('#letter-message').value.trim();
      if(!who||!body){form.reportValidity();return}
      drafted=`Hi Azharul,\n\n${body}\n\n— ${who}`;
      $('#letter-preview').textContent=body;$('#letter-signature').textContent='from, '+who;
      envelope.classList.remove('is-folded');void envelope.offsetWidth;
      if(reduced.matches){envelope.classList.add('is-folded');actions.hidden=false;}
      else{setTimeout(()=>{envelope.classList.add('is-folded');},350);setTimeout(()=>{actions.hidden=false;actions.scrollIntoView({behavior:'smooth',block:'nearest'})},1400)}
      $('#letter-status').textContent='Your letter is ready. Copy it, then paste it into LinkedIn to send.';
    });
    form.addEventListener('input',()=>{actions.hidden=true;envelope.classList.remove('is-folded')});
    $('#letter-copy').addEventListener('click',async()=>{
      if(!drafted)return;
      try{await navigator.clipboard.writeText(drafted);$('#letter-status').textContent='Copied! Open LinkedIn and paste the note yourself.';}
      catch{$('#letter-status').textContent='Copy unavailable here. Select the text in the form and paste it into LinkedIn.';}
    });

    // The terminal is a bounded command palette, NOT a JavaScript interpreter.
    const term=$('#secret-terminal'),out=$('#terminal-output'),inp=$('#terminal-command'),termToggle=$('#terminal-toggle');
    const print=(str,cls='result')=>{const p=document.createElement('p');p.className=cls;p.textContent=str;out.append(p);out.scrollTop=out.scrollHeight};
    const closeTerm=()=>{term.hidden=true;termToggle.setAttribute('aria-expanded','false');termToggle.focus()};
    const openTerm=()=>{term.hidden=false;termToggle.setAttribute('aria-expanded','true');inp.focus()};
    termToggle.addEventListener('click',()=>{term.hidden?openTerm():closeTerm()});$('#terminal-close').addEventListener('click',closeTerm);
    const commands={
      help:'Commands: help · whoami · skills · rust · projects · linkedin · coffee · clear · exit',
      whoami:'Azharul Islam — software engineer building mobile apps and backends. This is a hand-drawn personal sketchbook.',
      skills:'Native Android · native iOS · Flutter/Dart · Go · SQL · PostgreSQL · SQLite · Rust basics (Flutter FFI).',
      rust:'Basic Rust familiarity. I have used Rust with Flutter through FFI and want to do more with Rust in future.',
      projects:'Open the project notebook: Flutter + Rust FFI learning experiment, plus two labeled sample case studies.',
      linkedin:'linkedin.com/in/azharcse/ — use the visible LinkedIn link in Contact to open the real profile.',
      coffee:'First the sketch. Then the commit.'
    };
    $('#terminal-form').addEventListener('submit',e=>{
      e.preventDefault();const cmd=inp.value.trim().toLowerCase();inp.value='';if(!cmd)return;
      print('> '+cmd,'cmd');
      if(cmd==='clear'){out.replaceChildren();return}
      if(cmd==='exit'){closeTerm();return}
      print(Object.hasOwn(commands,cmd)?commands[cmd]:'Command not found. Try help.');
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!term.hidden)closeTerm()});
  });
})();


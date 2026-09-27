/*
 * Real path lettering, not text rendered with a handwriting font.
 * Every glyph below is a deliberately irregular pen path. Repeated glyphs
 * have alternate drawings, changing rotation, baseline, scale, ink pressure
 * and a little bit of incidental wobble at render time.
 * The original accessible text stays in data-ink / aria-label.
 */
(() => {
  'use strict';
  const G = {
    a:{w:13,s:['M10 8Q6 5 3 10Q0 15 5 18Q9 20 11 13','M10 9q0 5 1 9'],v:[['M11 10Q7 6 4 9 0 11 3 16t7-1','M10 9q-1 7 2 10'],['M9 9q-5-4-8 3-2 7 4 7 4 0 5-6','M9 9q1 4 2 9']]},
    b:{w:14,s:['M3 1Q5 8 4 18','M4 10Q11 5 12 12 14 20 4 18'],v:[['M4 1Q2 12 4 19','M4 11q9-8 10 1 0 8-10 7']]},
    c:{w:12,s:['M11 9Q5 5 3 10q-5 8 3 9 4 0 6-3'],v:[['M10 9Q5 6 3 11-1 20 10 17']]},
    d:{w:14,s:['M11 2q-1 9 0 17','M10 9Q5 5 2 12q-3 7 4 7 3 0 5-5'],v:[['M12 0q-4 12 0 20','M10 8Q3 5 2 13t8 3']]},
    e:{w:12,s:['M3 14Q15 13 10 9 6 4 3 10q-5 10 6 9l3-2'],v:[['M2 13q12 1 9-4Q6 4 3 10q-4 11 8 8'],['M3 13q10-2 8-5-5-5-8 3-4 10 8 7']]},
    f:{w:9,s:['M8 4Q5-2 3 6l1 16q1 3-3 4','M1 11q4-1 8 0'],v:[['M8 3Q2 0 4 10l0 15','M1 12q4-2 9-2']]},
    g:{w:14,s:['M11 10Q6 5 3 11 0 19 9 17','M11 8q-1 15-5 18-3 2-7-1'],v:[['M11 8Q4 4 2 12q-1 8 8 5','M11 9q0 13-4 17Q3 29 0 25']]},
    h:{w:14,s:['M3 1Q4 10 4 19','M4 12Q9 5 12 11l1 8'],v:[['M3 2 4 20','M5 13Q12 5 12 13l0 6']]},
    i:{w:6,s:['M3 9q-1 5 0 10','M3 3l0 1'],v:[['M2 9q1 6 1 9','M4 3l-1 0']]},
    j:{w:7,s:['M5 9q1 11-2 17-2 3-5 1','M4 2l1 1']},
    k:{w:13,s:['M4 1q0 8-1 18','M12 8 4 14l9 5'],v:[['M3 0l1 19','M13 7 4 14l7 6']]},
    l:{w:7,s:['M3 1Q4 9 3 17q0 3 3 2'],v:[['M4 1Q2 14 4 19l2 0']]},
    m:{w:21,s:['M2 9q2 5 1 10','M4 13q5-8 7-3 1 3 0 9','M12 13q5-8 7-3 1 3 0 9'],v:[['M2 10l1 9M4 13q7-8 7-2v8M12 13q8-9 8-2v8']]},
    n:{w:14,s:['M2 9q2 5 1 10','M4 13Q12 4 12 13l0 6'],v:[['M3 9l0 10M4 13q9-9 9 0l-1 6']]},
    o:{w:13,s:['M7 8Q1 7 2 14q1 8 8 4 5-4 1-9-2-2-4-1z'],v:[['M7 8Q1 8 2 14 3 21 9 18q5-3 2-9-1-2-4-1z'],['M6 8Q1 9 2 15t8 3q5-4 0-9-1-2-4-1z']]},
    p:{w:14,s:['M3 9q1 10 0 18','M4 12q7-8 9 0 2 9-9 6'],v:[['M3 9q2 13 1 18M5 12q8-7 8 1t-9 5']]},
    q:{w:14,s:['M11 9Q6 6 3 11-1 19 9 17','M11 9q-2 10 1 18'],v:[['M12 9Q4 5 2 13q-2 8 8 4M11 9q-1 14 2 18']]},
    r:{w:10,s:['M2 9q2 6 1 10','M4 14q2-7 6-5'],v:[['M3 9l0 10M4 14q3-8 7-5']]},
    s:{w:11,s:['M10 9Q3 5 2 12q0 3 6 3 6 4-2 5-4 0-6-2'],v:[['M10 9Q2 6 2 11q0 4 6 5t-6 3'],['M10 9q-7-4-9 3 1 3 7 4 5 5-7 3']]},
    t:{w:9,s:['M5 3q-1 7-1 13 0 4 5 3','M1 10q5 1 8 0'],v:[['M5 3q-2 12 0 16l3-1M1 11q6-2 8-1']]},
    u:{w:14,s:['M2 9q-1 7 2 9 4 2 8-7','M12 9q-1 5 1 10'],v:[['M2 9q-2 11 5 10 4-1 5-10M12 9q-1 7 1 10']]},
    v:{w:13,s:['M2 9q2 6 4 11Q10 15 12 9'],v:[['M2 9q0 7 5 10l5-11']]},
    w:{w:20,s:['M1 9q1 9 5 10l4-9q1 8 4 9l5-10'],v:[['M2 9q1 7 4 11l4-10 5 10 5-12']]},
    x:{w:13,s:['M3 9q4 5 8 10','M11 8Q7 13 2 20']},
    y:{w:13,s:['M2 9q0 10 5 9 3 0 5-9','M11 9q-1 11-6 17-3 3-6 1'],v:[['M2 9q-1 10 5 10 3-1 5-9M12 9q-3 16-8 18l-4-1']]},
    z:{w:12,s:['M2 9q6-2 9-1L3 19q4 1 9-1'],v:[['M2 9l9-1-8 12 9-1']]},
    '0':{w:13,s:['M7 3Q1 4 2 13t9 5q4-7 0-13Q9 2 7 3z']},
    '1':{w:10,s:['M2 8l5-5 0 17M2 20h10']},
    '2':{w:12,s:['M2 8q3-8 9-3 4 5-7 13l-2 2 11-1']},
    '3':{w:12,s:['M2 5q8-5 10 1l-6 6q11-2 6 6-4 5-11 1']},
    '4':{w:13,s:['M9 3 2 14l11-1M10 3l1 18']},
    '5':{w:12,s:['M11 4 4 5 2 12q12-4 11 5-1 7-12 3']},
    '6':{w:12,s:['M10 4Q3 3 2 13q-1 9 7 7 7-4 2-9-4-4-9 1']},
    '7':{w:12,s:['M1 5q6-2 12-1Q5 12 4 21']},
    '8':{w:12,s:['M6 3q-8 4 0 9 9-5 2-9H6M6 12q-10 7-1 9 10 2 7-5-2-3-6-4']},
    '9':{w:12,s:['M11 12Q7 3 3 5q-6 7 4 9l4-2Q11 19 3 21']},
    '.':{w:6,s:['M3 19l1 1']}, ',':{w:6,s:['M4 18q-2 6-4 7']}, '!':{w:6,s:['M3 3q1 6 0 11','M3 19l1 1']},
    '?':{w:11,s:['M1 7q1-6 7-4 8 3 0 11l-1 2','M6 21l1 1']},
    "'":{w:5,s:['M3 2q1 3-1 6']}, '’':{w:5,s:['M3 2q1 3-1 6']},
    ':':{w:6,s:['M3 9l1 1','M3 18l1 1']}, ';':{w:6,s:['M3 9l1 1','M4 19q-2 5-4 5']},
    '-':{w:10,s:['M1 14q5-2 9 0']}, '_':{w:11,s:['M1 23q5-2 10 0']},
    '/':{w:12,s:['M11 2Q6 11 1 22']}, '\\':{w:12,s:['M1 3q5 11 11 19']},
    '&':{w:17,s:['M14 5Q6 1 5 7q-1 5 9 12-6 7-12 1-4-5 4-11l11 11']},
    '+':{w:12,s:['M2 12q5 1 10 0','M7 5q0 7 0 15']},
    '#':{w:17,s:['M5 4q0 9-2 17M13 3q-2 9-2 18M1 10q8 2 15-1M0 16q9 2 16 0']},
    '@':{w:19,s:['M14 16q-7 7-9 0-1-7 6-7 5-1 3 8 4 3 5-5Q19 1 9 3-4 6 2 20q7 10 18 1']},
    '(':{w:7,s:['M6 2Q-2 12 6 24']}, ')':{w:7,s:['M1 2Q9 12 1 24']},
    '[':{w:7,s:['M6 2 2 2 2 23l5 0']}, ']':{w:7,s:['M1 2 6 2 6 23l-5 0']},
    '{':{w:10,s:['M9 1Q4 1 4 7t-3 5q4 1 3 5t5 7']}, '}':{w:10,s:['M1 1Q6 1 6 7t3 5q-4 1-3 5t-5 7']},
    '=':{w:13,s:['M1 10q5 1 11-1M2 17q5-1 11 0']},
    '<':{w:11,s:['M10 5 1 13l9 8']}, '>':{w:11,s:['M1 5 10 13l-9 8']},
    '*':{w:13,s:['M6 2l1 21M1 8l11 10M12 6 1 19']},
    '%':{w:20,s:['M17 2Q9 13 2 22','M5 5q-5 5 1 6 6-2 2-6z','M15 15q-5 4-1 7 6 2 6-4-1-3-5-3z']},
    '|':{w:8,s:['M4 3q-1 9 0 20']},
    '→':{w:20,s:['M1 12q8 1 17-1M12 4l7 7-7 8']},
    '↗':{w:20,s:['M2 20q10-8 16-17M8 3l11-1-1 11']}
  };

  // Uppercase letters are drawn separately instead of machine-scaled lower-case.
  const U = {
    A:[17,'M2 20Q9 2 11 1q3 10 6 20|M5 14q5-3 10 0'],B:[16,'M3 2Q5 11 4 21|M4 3Q17-1 14 8q-1 5-9 4Q19 9 15 18q-4 5-12 2'],C:[17,'M16 5Q5-1 3 11q-3 11 9 10l4-3'],D:[18,'M3 2Q4 12 4 21|M3 2Q21-1 18 12q-1 11-14 9'],E:[15,'M14 3 3 2 4 21l11-2|M4 12q6 1 9-1'],F:[15,'M3 2q1 9 1 20|M4 3q5-2 11-1M4 12q5-1 9 0'],G:[19,'M18 5Q4-2 2 12q-1 14 17 7l-1-7-7 1'],H:[18,'M3 2q1 11 0 20M16 2q-2 10 0 20M3 12q8-2 13 1'],I:[9,'M4 2q2 9 1 20M1 3l8-1M1 21h8'],J:[13,'M11 2q1 14-1 18-2 4-9 0'],K:[17,'M3 2v19M16 2Q10 9 3 13l14 8'],L:[14,'M4 2q-1 11 0 20l11-1'],M:[21,'M3 21 2 2l9 12L20 2l1 20'],N:[19,'M3 22 2 3l14 19V2'],O:[19,'M10 3Q2 3 2 13q1 10 10 9 10-2 7-13-2-8-9-6z'],P:[16,'M3 22 3 3Q18-1 16 10q-2 8-12 6'],Q:[19,'M10 3Q1 4 2 13q0 11 12 9 8-3 6-12-2-8-10-7zM13 17l7 8'],R:[18,'M3 22 3 2Q18-1 16 10q-1 8-12 6M8 15l10 7'],S:[16,'M15 5Q6-1 2 9q0 5 10 5 8 2 3 7-6 5-14-1'],T:[17,'M1 3Q9 1 17 3M9 3v19'],U:[18,'M2 2q-1 20 8 20 10 0 8-20'],V:[18,'M1 3q4 12 8 19Q15 13 18 2'],W:[24,'M1 3q1 13 5 19L12 8l6 14 6-19'],X:[18,'M2 3q6 8 15 19M17 2 2 22'],Y:[17,'M1 3q4 6 8 10l8-11M9 13l1 9'],Z:[16,'M2 3 15 2 2 21l14-1']
  };
  Object.entries(U).forEach(([c,[w,paths]]) => G[c]={w,s:paths.split('|')});
  G[' ']={w:6,s:[]};
  const NS='http://www.w3.org/2000/svg';
  const make=(name,attrs={})=>{const el=document.createElementNS(NS,name);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));return el;};
  const hash=str=>{let x=2166136261;for(let i=0;i<str.length;i++)x=Math.imul(x^str.charCodeAt(i),16777619);return x>>>0;};
  const random=(n)=>{n|=0;n=(n+0x6D2B79F5)|0;let t=Math.imul(n^n>>>15,1|n);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;};
  let serial=0;
  function createWord(word, id=0, animate=false, wordDelay=0){
    const span=document.createElement('span'); span.className='ink-word'+(animate?' is-writing':'');span.setAttribute('aria-hidden','true');
    const letters=Array.from(word);let x=1;const seed=hash(word+'|'+id);
    const groups=[];
    for(let i=0;i<letters.length;i++){
      const char=letters[i],g=G[char]||G[char.toLowerCase()]||G['?'];
      const rng=(k)=>random(seed+i*2099+k*431);
      const scale=0.915+rng(1)*0.175;const height=0.955+rng(2)*0.10;
      const advance=(g.w+(i===0?0:-.5)+(rng(3)-.5)*1.7)*scale;
      const y=(rng(4)-.5)*3.6 + Math.sin(i*.88+seed*.001)*.65;
      const theta=(rng(5)-.5)*13;
      const group=make('g',{transform:`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${theta.toFixed(2)} ${(g.w/2).toFixed(2)} 12) scale(${scale.toFixed(3)} ${height.toFixed(3)})`});
      const strokes=g.v && rng(6)>.52?g.v[Math.floor(rng(7)*g.v.length)]:g.s;
      strokes.forEach((d,j)=>{
        if(i%7===0&&j===0&&rng(8)>.63){
          const ghost=make('path',{d,fill:'none','stroke-width':1.10,opacity:'.16',transform:'translate(0.65 -0.55)'});group.appendChild(ghost);
        }
        const path=make('path',{d,fill:'none','stroke-width':(1.5+rng(j+9)*.48).toFixed(2),opacity:(.84+rng(j+31)*.16).toFixed(2),'stroke-linecap':'round','stroke-linejoin':'round'});
        if(animate){path.classList.add('writing-path');path.setAttribute('pathLength','1');path.style.animationDelay=`${(i*75+j*52+wordDelay)}ms`;}
        group.appendChild(path);
      });
      groups.push(group);x+=advance;
      if(i<letters.length-1 && rng(14)>.77 && 'amenou'.includes(char.toLowerCase())){
        const join=make('path',{d:`M${(x-1).toFixed(1)} 16q1 1 2 0`,fill:'none','stroke-width':'.8',opacity:'.38'});groups.push(join);
      }
    }
    const svg=make('svg',{viewBox:`0 -4 ${(x+3).toFixed(2)} 32`,width:`${(x+3)/32*1.20}em`,height:'1.2em',preserveAspectRatio:'xMinYMid meet',focusable:'false'});
    svg.classList.add('word-strokes');svg.style.transform=`rotate(${((random(seed)-.5)*2.1).toFixed(2)}deg)`;
    groups.forEach(g=>svg.appendChild(g));span.appendChild(svg);
    return span;
  }
  function paint(el,text,opts={}){
    if(!el)return;
    const value=String(text==null?'':text);
    el.setAttribute('data-ink',value);el.setAttribute('aria-label',value);
    el.replaceChildren();
    const pieces=value.match(/\S+|\s+/g)||[];const frag=document.createDocumentFragment();let wordNo=0;
    pieces.forEach((piece,i)=>{
      if(/^\s+$/.test(piece)){const gap=document.createElement('span');gap.className='ink-gap'; gap.style.width=`${.15+Math.min(piece.length,3)*.07}em`;gap.setAttribute('aria-hidden','true');frag.appendChild(gap);}
      else frag.appendChild(createWord(piece,++serial+i,opts.animate, wordNo++*340+(opts.startDelay||0)));
    });
    el.appendChild(frag);
  }
  document.addEventListener('DOMContentLoaded',()=>{
    let headingIndex=0;
    document.querySelectorAll('[data-ink]').forEach(el=>{const isHeading=el.classList.contains('headline');paint(el,el.getAttribute('data-ink'),{animate:isHeading,startDelay:isHeading?(headingIndex++*550):0});});
    document.body.classList.add('ink-ready');
  });
  window.PenLetters={paint,createWord};
})();


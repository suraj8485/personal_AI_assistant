// Hover-reactive text: wraps headline letters / subtitle words in <span>
// so they can move toward/away from the cursor. Depends on `mouse` and
// `reduceMotion` from stars.js, so this file must load AFTER stars.js.

/* ---------------- MAGNETIC LETTERS ---------------- */
function wrapLetters(el){
  const text = el.textContent;
  el.textContent = '';
  [...text].forEach(ch => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    el.appendChild(span);
  });
}
wrapLetters(document.getElementById('accentWord'));
(function wrapHeadlinePlain(){
  const h = document.getElementById('headline');
  const plainText = h.firstChild;
  if(plainText && plainText.nodeType === 3){
    const frag = document.createDocumentFragment();
    [...plainText.textContent].forEach(ch=>{
      const span = document.createElement('span');
      span.className='letter';
      span.textContent = ch===' '?'\u00A0':ch;
      frag.appendChild(span);
    });
    h.replaceChild(frag, plainText);
  }
})();

(function wrapWords(){
  const sub = document.getElementById('subtitle');
  const text = sub.textContent;
  sub.textContent = '';
  text.split(' ').forEach((w,i,arr)=>{
    const span = document.createElement('span');
    span.className='word';
    span.textContent = w;
    sub.appendChild(span);
    if(i<arr.length-1) sub.appendChild(document.createTextNode(' '));
  });
})();

let letterEls = [];
function refreshLetters(){
  letterEls = [...document.querySelectorAll('#headline .letter')];
}
refreshLetters();
window.addEventListener('resize', refreshLetters);

function animateLetters(){
  if(!reduceMotion){
    for(const el of letterEls){
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = cx - mouse.x, dy = cy - mouse.y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      const maxDist = 90;
      if(dist < maxDist){
        const f = 1 - dist/maxDist;
        el.style.transform = `translateY(${-14*f}px) scale(${1+f*0.35})`;
        el.style.color = f > 0.4 ? 'var(--gold-light)' : '';
      } else {
        el.style.transform = '';
        el.style.color = '';
      }
    }
  }
  requestAnimationFrame(animateLetters);
}
animateLetters();

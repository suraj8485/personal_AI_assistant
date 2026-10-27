// Interactive star field: draws stars on <canvas id="stars"> and makes
// them glow/drift away from the cursor. Exposes `mouse` and `reduceMotion`
// which the other scripts (loaded after this one) also use.

/* ---------------- STARFIELD ---------------- */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let W, H, stars = [];
const mouse = { x: -9999, y: -9999 };
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  const count = Math.min(220, Math.floor((W*H)/9000));
  stars = Array.from({length:count}, () => {
    const x = Math.random()*W, y = Math.random()*H;
    return {
      x, y, ox:x, oy:y,
      vx:0, vy:0,
      r: Math.random()*1.4 + 0.4,
      baseAlpha: Math.random()*0.5 + 0.35,
      phase: Math.random()*Math.PI*2,
      speed: Math.random()*0.015 + 0.006
    };
  });
}
window.addEventListener('resize', resize);
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

let t = 0;
function drawStars(){
  t += 1;
  ctx.clearRect(0,0,W,H);
  for(const s of stars){
    const dx = s.x - mouse.x, dy = s.y - mouse.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const radius = 130;
    let glow = 0;
    if(dist < radius){
      const force = (radius - dist) / radius;
      glow = force;
      if(!reduceMotion){
        const angle = Math.atan2(dy, dx);
        s.vx += Math.cos(angle) * force * 0.9;
        s.vy += Math.sin(angle) * force * 0.9;
      }
    }
    if(!reduceMotion){
      s.vx += (s.ox - s.x) * 0.02;
      s.vy += (s.oy - s.y) * 0.02;
      s.vx *= 0.9; s.vy *= 0.9;
      s.x += s.vx; s.y += s.vy;
    }
    const twinkle = Math.sin(t*s.speed + s.phase) * 0.3;
    const alpha = Math.min(1, s.baseAlpha + twinkle + glow*0.5);
    const rad = s.r + glow*1.6;

    ctx.beginPath();
    const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, rad*3);
    grad.addColorStop(0, `rgba(255,244,214,${alpha})`);
    grad.addColorStop(1, 'rgba(255,244,214,0)');
    ctx.fillStyle = grad;
    ctx.arc(s.x, s.y, rad*3, 0, Math.PI*2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.arc(s.x, s.y, rad, 0, Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}
resize();
drawStars();

// A cursor-origin glass bloom for internal page changes.
const screenTransition = document.getElementById('screenTransition');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let transitionRunning = false;
let bloomX = window.innerWidth / 2;
let bloomY = window.innerHeight / 2;

function setBloomOrigin(event) {
  bloomX = event.clientX;
  bloomY = event.clientY;
}

window.addEventListener('pointermove', setBloomOrigin);
window.addEventListener('pointerdown', setBloomOrigin);

window.playScreenFlip = callback => {
  if (transitionRunning) return;
  if (reducedMotion) {
    callback();
    return;
  }

  transitionRunning = true;
  screenTransition.style.setProperty('--bloom-x', `${bloomX}px`);
  screenTransition.style.setProperty('--bloom-y', `${bloomY}px`);
  screenTransition.classList.add('active');
  setTimeout(() => {
    callback();
    screenTransition.classList.add('revealing');
  }, 500);
  setTimeout(() => {
    screenTransition.classList.remove('active', 'revealing');
    transitionRunning = false;
  }, 1120);
};

// A small light follows the pointer and expands into a glow on interactive taps.
const cursorLight = document.getElementById('cursorLight');
const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const interactive = 'a, button, [role="button"], input[type="submit"]';

if (!noMotion) {
  window.addEventListener('pointermove', event => {
    cursorLight.style.left = `${event.clientX}px`;
    cursorLight.style.top = `${event.clientY}px`;
    cursorLight.classList.add('visible');
  });

  document.addEventListener('pointerleave', () => cursorLight.classList.remove('visible'));

  document.addEventListener('pointerdown', event => {
    if (!event.target.closest(interactive)) return;

    cursorLight.style.left = `${event.clientX}px`;
    cursorLight.style.top = `${event.clientY}px`;
    cursorLight.classList.add('visible');
    cursorLight.classList.remove('burst');
    void cursorLight.offsetWidth;
    cursorLight.classList.add('burst');
  });
}

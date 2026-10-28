export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Glides mouse-wheel scrolling: each wheel step moves a target, and the page eases toward it every
 * frame, so scroll-linked animations move smoothly instead of jumping a notch at a time. Keyboard,
 * scrollbar, touch and anchor scrolling stay native.
 */
export function smoothWheel() {
  if (prefersReducedMotion()) return;
  let target = 0, current = 0, last = 0, raf = 0;

  const step = (t: number) => {
    // Something else moved the page (an anchor link, the keyboard): let it win.
    if (Math.abs(scrollY - current) > 2) { raf = 0; return; }
    current += (target - current) * (1 - Math.exp(-Math.max(0, t - last) / 110)); // frame-rate independent ease-out
    last = t;
    if (Math.abs(target - current) < 0.5) current = target;
    scrollTo({ top: current, behavior: 'instant' });
    raf = current === target ? 0 : requestAnimationFrame(step);
  };

  addEventListener('wheel', e => {
    // Leave pinch-zoom, sideways scrolling and the command menu's own list to the browser.
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || (e.target as Element).closest('dialog')) return;
    e.preventDefault();
    if (!raf) { target = current = scrollY; last = performance.now(); }
    const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? innerHeight : 1;
    target = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, target + e.deltaY * unit));
    raf ||= requestAnimationFrame(step);
  }, { passive: false });
}

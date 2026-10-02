import { useEffect, useRef, useState, type PointerEvent } from 'react';

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Adds `in` to the element the first time it scrolls into view (pairs with the .reveal class). */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown] as const;
}

/** Id of the section currently in the middle of the viewport, for nav highlighting. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('');
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
    }, { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/**
 * Writes the pointer position into CSS variables on the hovered element: --x/--y in px for
 * spotlights, --rx/--ry in degrees for tilt. CSS variables instead of React state, so moving
 * the pointer never re-renders.
 */
export function trackPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  el.style.setProperty('--x', `${x}px`);
  el.style.setProperty('--y', `${y}px`);
  el.style.setProperty('--rx', `${(0.5 - y / r.height) * 8}deg`);
  el.style.setProperty('--ry', `${(x / r.width - 0.5) * 8}deg`);
}

export function resetPointer(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
}

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

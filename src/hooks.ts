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

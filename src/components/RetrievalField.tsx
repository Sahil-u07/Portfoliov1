import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks';

const N = 90, K = 5;
type P = { x: number; y: number; vx: number; vy: number };

/**
 * Hero panel: dots are "passages", the pointer is the "query", and the K
 * nearest dots light up with their rank. A 2D sketch of nearest-neighbour
 * search, the idea behind EvidenceRAG's dense retrieval. With no pointer, the
 * query wanders on its own.
 */
export default function RetrievalField() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext('2d')!;
    const still = prefersReducedMotion();
    const pts: P[] = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004, vy: (Math.random() - 0.5) * 0.0004,
    }));
    let w = 0, h = 0, raf = 0, pointer: { x: number; y: number } | null = null;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    resize();

    const onMove = (e: PointerEvent) => { pointer = { x: e.offsetX, y: e.offsetY }; };
    const onLeave = () => { pointer = null; };
    c.addEventListener('pointermove', onMove);
    c.addEventListener('pointerleave', onLeave);

    const frame = (t: number) => {
      if (!still) for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
      }
      const q = pointer ?? {
        x: w * (0.5 + 0.32 * Math.sin(t / 3100)),
        y: h * (0.5 + 0.32 * Math.sin(t / 2300)),
      };
      const ranked = pts
        .map(p => ({ x: p.x * w, y: p.y * h }))
        .map(p => ({ ...p, d: Math.hypot(p.x - q.x, p.y - q.y) }))
        .sort((a, b) => a.d - b.d); // ponytail: full sort of 90 points per frame, fine at this size

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgb(148 163 184 / 0.5)';
      for (const p of ranked.slice(K)) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 7); ctx.fill(); }

      ctx.font = '11px "JetBrains Mono", monospace';
      ranked.slice(0, K).forEach((p, i) => {
        ctx.strokeStyle = `rgb(251 191 36 / ${0.55 - i * 0.08})`;
        ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, 7); ctx.fill();
        ctx.fillText(String(i + 1), p.x + 7, p.y - 6);
      });
      ctx.strokeStyle = '#fbbf24';
      ctx.beginPath(); ctx.arc(q.x, q.y, 7, 0, 7); ctx.stroke();

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); c.removeEventListener('pointermove', onMove); c.removeEventListener('pointerleave', onLeave); };
  }, []);

  return (
    <figure className="field">
      <div className="term-bar"><i /><i /><i /><span>nearest-neighbour search · k = {K}</span></div>
      <canvas ref={canvas} aria-hidden="true" />
      <figcaption>Move your cursor over the field: it's the query, and the {K} nearest passages light up in rank order. A 2D sketch of the dense retrieval inside EvidenceRAG.</figcaption>
    </figure>
  );
}

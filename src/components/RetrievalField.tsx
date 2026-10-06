import { useEffect, useRef } from 'react';
import { prefersReducedMotion, resetPointer, trackPointer } from '../hooks';
import './RetrievalField.css';

const K = 5, PER_TOPIC = 24, FLOOR = 1.25;
type V = [number, number, number];

// Passages clump into topics, like real embeddings. Each topic gets a centre and a hue (none lime, which marks results).
const TOPICS = [15, 160, 200, 265, 330].map((hue, i) => {
  const a = (i / 5) * Math.PI * 2;
  return { hue, c: [0.7 * Math.cos(a), 0.5 * Math.sin(a * 2), 0.7 * Math.sin(a)] as V };
});
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.35; // cheap bell curve

/**
 * A 3D "embedding space". Dots are passages grouped into topic
 * clusters, the ring is a query drifting between them, and its K nearest
 * passages (by 3D distance) light up with their rank, a sketch of EvidenceRAG's
 * dense retrieval. Drag to spin it; it keeps spinning with inertia.
 */
export default function RetrievalField() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext('2d')!;
    const still = prefersReducedMotion();
    const accent = getComputedStyle(c).getPropertyValue('--accent');
    const pts = TOPICS.flatMap(({ hue, c: [x, y, z] }) =>
      Array.from({ length: PER_TOPIC }, () => ({ hue, p: [x + gauss(), y + gauss(), z + gauss()] as V })));
    let w = 0, h = 0, raf = 0;
    let yaw = 0.6, pitch = 0.32, spin = still ? 0 : 0.003, drag: { x: number; y: number } | null = null;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    resize();

    // Drag to spin: horizontal motion feeds the spin speed, vertical motion tilts the camera.
    const onDown = (e: PointerEvent) => { drag = { x: e.clientX, y: e.clientY }; c.setPointerCapture(e.pointerId); };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      spin = (e.clientX - drag.x) * 0.004;
      pitch = Math.max(-0.1, Math.min(1.1, pitch + (e.clientY - drag.y) * 0.004));
      drag = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => { drag = null; };
    c.addEventListener('pointerdown', onDown);
    c.addEventListener('pointermove', onMove);
    c.addEventListener('pointerup', onUp);
    c.addEventListener('pointercancel', onUp);

    // Rotate around Y then X, then perspective-project. Returns [x, y, depth scale].
    const project = ([x, y, z]: V) => {
      const x1 = x * Math.cos(yaw) + z * Math.sin(yaw), z1 = z * Math.cos(yaw) - x * Math.sin(yaw);
      const y1 = y * Math.cos(pitch) - z1 * Math.sin(pitch), z2 = z1 * Math.cos(pitch) + y * Math.sin(pitch);
      const s = 3.6 / (z2 + 3.6), f = Math.min(w, h) * 0.38;
      return [w / 2 + x1 * f * s, h * 0.44 + y1 * f * s, s] as const;
    };
    const line = (a: V, b: V) => {
      const [ax, ay] = project(a), [bx, by] = project(b);
      ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
    };

    const frame = (t: number) => {
      if (!visible) { raf = 0; return; } // off screen: stop until the observer restarts it
      yaw += spin;
      if (!drag && !still) spin += (0.003 - spin) * 0.03; // inertia settles back to a slow idle spin
      const q: V = [0.75 * Math.sin(t / 3100), 0.5 * Math.sin(t / 2300), 0.75 * Math.cos(t / 2700)];
      const ranked = pts
        .map(o => ({ ...o, d: Math.hypot(o.p[0] - q[0], o.p[1] - q[1], o.p[2] - q[2]) }))
        .sort((a, b) => a.d - b.d); // ponytail: full sort of 120 points per frame, fine at this size
      ctx.clearRect(0, 0, w, h);

      // Floor grid: the strongest depth cue
      ctx.strokeStyle = 'rgb(232 229 222 / 0.08)';
      ctx.beginPath();
      for (let i = -1.5; i <= 1.51; i += 0.375) { line([i, FLOOR, -1.5], [i, FLOOR, 1.5]); line([-1.5, FLOOR, i], [1.5, FLOOR, i]); }
      ctx.stroke();

      // Passages, farthest first so near ones overlap them
      const drawn = ranked.slice(K).map(o => ({ o, s: project(o.p) })).sort((a, b) => a.s[2] - b.s[2]);
      for (const { o, s: [x, y, s] } of drawn) {
        ctx.fillStyle = `hsl(${o.hue} 55% 65% / ${Math.min(1, 0.12 + 0.6 * s ** 4)})`;
        ctx.beginPath(); ctx.arc(x, y, 2.1 * s ** 2, 0, 7); ctx.fill();
      }

      // Query, its neighbours, and their shadows dropped onto the floor
      const [qx, qy, qs] = project(q);
      const near = ranked.slice(0, K);
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.25;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      for (const p of [q, ...near.map(o => o.p)]) line(p, [p[0], FLOOR, p[2]]);
      ctx.stroke();
      ctx.setLineDash([]);
      for (const p of [q, ...near.map(o => o.p)]) {
        const [sx, sy, ss] = project([p[0], FLOOR, p[2]]);
        ctx.beginPath(); ctx.ellipse(sx, sy, 6 * ss, 2.2 * ss, 0, 0, 7); ctx.stroke();
      }

      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = accent;
      near.forEach(({ p }, i) => {
        const [x, y, s] = project(p);
        ctx.globalAlpha = 0.6 - i * 0.08;
        ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(x, y); ctx.stroke();
        ctx.globalAlpha = 0.18;
        ctx.beginPath(); ctx.arc(x, y, 9 * s, 0, 7); ctx.fill(); // glow
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(x, y, 3.6 * s, 0, 7); ctx.fill();
        ctx.fillText(String(i + 1), x + 8, y - 7);
      });
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(qx, qy, 8 * qs, 0, 7); ctx.stroke();
      ctx.lineWidth = 1;

      raf = requestAnimationFrame(frame);
    };
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); });
    io.observe(c);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      c.removeEventListener('pointerdown', onDown); c.removeEventListener('pointermove', onMove);
      c.removeEventListener('pointerup', onUp); c.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return (
    <figure className="field" onPointerMove={trackPointer} onPointerLeave={resetPointer}>
      <div className="term-bar"><i /><i /><i /><span>search, in 3D</span></div>
      <canvas ref={canvas} aria-hidden="true" />
      <figcaption>Drag to spin it.</figcaption>
    </figure>
  );
}

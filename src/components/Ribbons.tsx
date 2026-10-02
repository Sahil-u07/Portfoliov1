import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks';

// Each bundle is a set of thin strands that pinch together and fan apart, so
// additive blending makes a bright core where they cross, like a light trail.
const BUNDLES = [
  { strands: 26, hue: 75, y: 0.8, rise: 0.75, amp: 0.12, freq: 2.2, speed: 0.00011 },
  { strands: 18, hue: 160, y: 0.95, rise: 0.6, amp: 0.09, freq: 1.6, speed: -0.00008 },
];

/** Full-page background of flowing light ribbons. They drift over time and shift as you scroll. */
export default function Ribbons() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext('2d')!;
    const still = prefersReducedMotion();
    let w = 0, h = 0, raf = 0;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 1.5);
      w = innerWidth; h = innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (still) draw(0);
    };

    const draw = (t: number) => {
      const s = scrollY / Math.max(h, 1); // viewports scrolled
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const b of BUNDLES) {
        const phase = t * b.speed + s * 0.9;
        const base = b.y + 0.18 * Math.sin(s * 1.3 + b.hue); // the bundle wanders up and down with scroll
        for (let k = 0; k < b.strands; k++) {
          const off = k / (b.strands - 1) - 0.5; // -0.5..0.5 across the bundle
          const alpha = 0.32 - Math.abs(off) * 0.4;
          const path = new Path2D();
          for (let x = -40; x <= w + 40; x += 18) {
            const u = x / w;
            const spread = Math.sin(u * 3.1 + phase * 2) * 0.09; // pinch and fan
            const y = h * (base - b.rise * Math.min(1, w / h) * u + b.amp * Math.sin(u * b.freq * Math.PI + phase * 6) + off * spread);
            if (x === -40) path.moveTo(x, y); else path.lineTo(x, y);
          }
          const color = (a: number) => `hsl(${b.hue + off * 40} 85% 62% / ${a})`;
          if (k % 3 === 0) { ctx.lineWidth = 6; ctx.strokeStyle = color(alpha * 0.12); ctx.stroke(path); } // soft halo
          ctx.lineWidth = 1; ctx.strokeStyle = color(alpha); ctx.stroke(path);
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    addEventListener('resize', resize);
    resize();
    if (!still) raf = requestAnimationFrame(function loop(t) { draw(t); raf = requestAnimationFrame(loop); });
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvas} className="ribbons" aria-hidden="true" />;
}

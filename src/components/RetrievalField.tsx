import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks';

const N = 110, K = 5;
type V = [number, number, number];

// The 12 edges of the cube that bounds the space, as pairs of corner indexes.
const CORNERS: V[] = [-1, 1].flatMap(x => [-1, 1].flatMap(y => [-1, 1].map(z => [x, y, z] as V)));
const EDGES = CORNERS.flatMap((a, i) => CORNERS.map((_, j) => [i, j]).filter(([, j]) =>
  j > i && a.filter((v, k) => v !== CORNERS[j][k]).length === 1));

/**
 * Hero panel: a slowly turning 3D "embedding space". Dots are passages, the
 * ring is the query, and its K nearest passages (by 3D distance) light up with
 * their rank: a sketch of EvidenceRAG's dense retrieval. Moving the pointer
 * over it orbits the camera.
 */
export default function RetrievalField() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext('2d')!;
    const still = prefersReducedMotion();
    const accent = getComputedStyle(c).getPropertyValue('--accent');
    const pts: V[] = Array.from({ length: N }, () => [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1]);
    let w = 0, h = 0, raf = 0;
    let yaw = 0.6, pitch = 0.35, aimYaw = 0, aimPitch = 0, offYaw = 0, offPitch = 0; // off* ease toward aim*, set by the pointer

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    resize();

    const onMove = (e: PointerEvent) => { aimYaw = (e.offsetX / w - 0.5) * 2.4; aimPitch = (e.offsetY / h - 0.5) * 1.4; };
    const onLeave = () => { aimYaw = aimPitch = 0; };
    c.addEventListener('pointermove', onMove);
    c.addEventListener('pointerleave', onLeave);

    // Rotate around Y then X, then perspective-project onto the canvas. Returns [x, y, scale].
    const project = ([x, y, z]: V) => {
      const ry = yaw + offYaw, rx = pitch + offPitch;
      const x1 = x * Math.cos(ry) + z * Math.sin(ry), z1 = z * Math.cos(ry) - x * Math.sin(ry);
      const y1 = y * Math.cos(rx) - z1 * Math.sin(rx), z2 = z1 * Math.cos(rx) + y * Math.sin(rx);
      const s = Math.min(w, h) * 1.15 / (z2 + 3.6);
      return [w / 2 + x1 * s, h / 2 + y1 * s, s / (Math.min(w, h) * 1.15 / 3.6)] as const;
    };

    const frame = (t: number) => {
      if (!still) yaw += 0.0025;
      offYaw += (aimYaw - offYaw) * 0.08; offPitch += (aimPitch - offPitch) * 0.08;
      const q: V = [0.7 * Math.sin(t / 3100), 0.6 * Math.sin(t / 2300), 0.7 * Math.cos(t / 2700)];
      const ranked = pts
        .map(p => ({ p, d: Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) }))
        .sort((a, b) => a.d - b.d); // ponytail: full sort of 110 points per frame, fine at this size

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = 'rgb(255 255 255 / 0.08)';
      ctx.beginPath();
      for (const [i, j] of EDGES) {
        const a = project(CORNERS[i]), b = project(CORNERS[j]);
        ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      }
      ctx.stroke();

      for (const { p } of ranked.slice(K)) {
        const [x, y, s] = project(p);
        ctx.fillStyle = `rgb(200 205 190 / ${0.15 + 0.45 * s ** 2})`; // farther dots are dimmer
        ctx.beginPath(); ctx.arc(x, y, 1.7 * s, 0, 7); ctx.fill();
      }

      const [qx, qy, qs] = project(q);
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.strokeStyle = ctx.fillStyle = accent;
      ranked.slice(0, K).forEach(({ p }, i) => {
        const [x, y, s] = project(p);
        ctx.globalAlpha = 0.55 - i * 0.08;
        ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(x, y); ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(x, y, 3.5 * s, 0, 7); ctx.fill();
        ctx.fillText(String(i + 1), x + 7, y - 6);
      });
      ctx.beginPath(); ctx.arc(qx, qy, 7 * qs, 0, 7); ctx.stroke();

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); c.removeEventListener('pointermove', onMove); c.removeEventListener('pointerleave', onLeave); };
  }, []);

  return (
    <figure className="field">
      <div className="term-bar"><i /><i /><i /><span>3D embedding space · k = {K}</span></div>
      <canvas ref={canvas} aria-hidden="true" />
      <figcaption>A 3D sketch of the dense retrieval inside EvidenceRAG: the ring is a query and its {K} nearest passages light up in rank order. Move your cursor over it to orbit the space.</figcaption>
    </figure>
  );
}

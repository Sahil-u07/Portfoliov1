import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks';

/** Small seeded random, so the skyline is the same city on every visit. */
function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

type Win = { x: number; y: number; on: boolean; warm: number };
type Layer = { img: HTMLCanvasElement; depth: number; wins: Win[] };
type Drop = { x: number; y: number; z: number };
type Bit = { x: number; y: number; vx: number; vy: number; life: number };

/**
 * Draws one row of buildings into its own canvas, wider than the banner so it can shift for parallax.
 * Returns the lit windows (they flicker each frame) and, for the front row, the roof height per column
 * so raindrops splash on the rooftops.
 */
function buildRow(w: number, h: number, seed: number, minH: number, maxH: number, color: string, winChance: number, roofs?: Float32Array) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d')!, r = rng(seed), wins: Win[] = [];
  g.fillStyle = color;
  for (let x = -10; x < w;) {
    const bw = 24 + r() * 60, bh = h * (minH + r() * (maxH - minH)), top = h - bh, kind = r();
    g.fillRect(x, top, bw, bh);
    if (kind < 0.18) { g.beginPath(); g.moveTo(x, top); g.lineTo(x + bw / 2, top - 12 - r() * 30); g.lineTo(x + bw, top); g.fill(); }
    else if (kind < 0.36) g.fillRect(x + bw / 2 - 1, top - 18 - r() * 40, 2, 18 + r() * 40);
    else if (kind < 0.5) g.fillRect(x + 5, top - 10, bw - 10, 10);
    if (roofs) for (let i = Math.max(0, Math.floor(x)); i < Math.min(w, x + bw); i++) roofs[i] = Math.min(roofs[i] || h, top);
    for (let wy = top + 7; wy < h - 6; wy += 10)
      for (let wx = x + 5; wx < x + bw - 6; wx += 8)
        if (r() < winChance) wins.push({ x: wx, y: wy, on: r() < 0.7, warm: r() });
    x += bw - 4 + r() * 8;
  }
  return { img: c, wins };
}

/** A soft, wide cloud texture that drifts across the sky and the street fog. */
function fogTexture(w: number, h: number, seed: number, alpha: number) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d')!, r = rng(seed);
  for (let i = 0; i < 40; i++) {
    const x = r() * w, y = h * (0.35 + r() * 0.4), rad = h * (0.1 + r() * 0.24); // stays inside the texture, so no hard edges
    const grad = g.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, `rgba(40,0,0,${alpha * (0.4 + r() * 0.6)})`);
    grad.addColorStop(1, 'rgba(40,0,0,0)');
    g.fillStyle = grad; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  return c;
}

/** A jagged bolt from the sky toward the city, with a few side forks. */
function bolt(x: number, h: number, r: () => number) {
  const paths: [number, number][][] = [];
  const grow = (x: number, y: number, len: number, spread: number, depth: number) => {
    const p: [number, number][] = [[x, y]];
    while (y < len) {
      x += (r() - 0.5) * spread; y += 6 + r() * 10; p.push([x, y]);
      if (depth < 2 && r() < 0.12) grow(x, y, y + (len - y) * 0.5, spread, depth + 1);
    }
    paths.push(p);
  };
  grow(x, 0, h * (0.55 + r() * 0.2), 22, 0);
  return paths;
}

/**
 * The live banner: a red night over a three-layer city. Rain falls at different depths and splashes on
 * the rooftops, fog drifts, windows flicker, searchlights sweep and lean toward the mouse, the ring from
 * the profile picture turns, and lightning strikes every few seconds. Everything shifts with the mouse
 * for depth. It pauses when scrolled away and draws one still frame for visitors who prefer less motion.
 */
export default function CityBanner() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!, g = canvas.getContext('2d')!, r = rng(42);
    const still = prefersReducedMotion();
    let W = 0, H = 0, layers: Layer[] = [], roofs = new Float32Array(0), skyFog: HTMLCanvasElement, streetFog: HTMLCanvasElement;
    let drops: Drop[] = [], bits: Bit[] = [];
    let mx = 0.5, my = 0.5, px = 0.5, py = 0.5; // pointer target and the eased value
    let flash = 0, bolts: [number, number][][] = [], nextStrike = 2500, raf = 0, visible = true, last = 0;
    const OVER = 60; // how far each row may slide for parallax

    const setup = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rw = W + OVER * 2;
      roofs = new Float32Array(rw);
      layers = [
        { ...buildRow(rw, H, 7, 0.28, 0.52, '#6e0000', 0), depth: 0.25 },
        { ...buildRow(rw, H, 11, 0.2, 0.4, '#2a0303', 0.05), depth: 0.55 },
        { ...buildRow(rw, H, 23, 0.1, 0.28, '#060203', 0.09, roofs), depth: 1 },
      ];
      skyFog = fogTexture(W * 2, H, 3, 0.35);
      streetFog = fogTexture(W * 2, H, 9, 0.6);
      drops = Array.from({ length: Math.round(W / 3) }, () => ({ x: r() * W, y: r() * H, z: 0.3 + r() * 0.7 }));
    };

    const frame = (t: number) => {
      const dt = Math.min(50, t - (last || t)); last = t;
      px += (mx - px) * 0.04; py += (my - py) * 0.04;
      const sway = (px - 0.5) * 2; // -1 .. 1

      // Sky, brighter while lightning is in the air
      const sky = g.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#4a0000'); sky.addColorStop(0.5, '#c80000'); sky.addColorStop(1, '#ff2a12');
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      const glowX = W * (0.72 - sway * 0.03), glowY = H * (0.32 - (py - 0.5) * 0.06);
      const glow = g.createRadialGradient(glowX, glowY, 0, glowX, glowY, H * 1.2);
      glow.addColorStop(0, 'rgba(255,70,40,0.75)'); glow.addColorStop(1, 'rgba(255,70,40,0)');
      g.fillStyle = glow; g.fillRect(0, 0, W, H);

      // The ring: a chalky dotted circle that turns and breathes
      const R = H * 0.42 + Math.sin(t / 1400) * 2;
      for (let i = 0; i < 420; i++) {
        const n = Math.sin(i * 78.233) * 43758.5453, a = i / 420 * Math.PI * 2 + t / 9000, j = (n - Math.floor(n) - 0.5) * 7; // grainy, like chalk
        g.fillStyle = `rgba(255,232,222,${0.4 + 0.5 * Math.abs(Math.sin(i * 7.3))})`;
        g.fillRect(glowX + Math.cos(a) * (R + j), glowY + Math.sin(a) * (R + j), 2, 2);
      }

      // Clouds drifting high up
      const cx = -((t / 60) % W);
      g.globalAlpha = 0.55; g.drawImage(skyFog, cx, -H * 0.35); g.globalAlpha = 1;

      // Searchlights: they sweep on their own and lean toward the mouse
      g.save(); g.globalCompositeOperation = 'lighter';
      [[0.28, 9000, 0], [0.84, 12500, 2]].forEach(([bx, period, phase]) => {
        const a = Math.sin(t / period * Math.PI * 2 + phase) * 0.45 + sway * 0.35;
        const x0 = W * bx - sway * OVER * 0.55, y0 = H, len = H * 2.2, half = 0.09;
        const beam = g.createLinearGradient(x0, y0, x0 + Math.sin(a) * len, y0 - Math.cos(a) * len);
        beam.addColorStop(0, 'rgba(255,215,190,0.32)'); beam.addColorStop(1, 'rgba(255,215,190,0)');
        g.fillStyle = beam; g.beginPath(); g.moveTo(x0 - 3, y0); g.moveTo(x0 + 3, y0);
        g.lineTo(x0 + Math.sin(a + half) * len, y0 - Math.cos(a + half) * len);
        g.lineTo(x0 + Math.sin(a - half) * len, y0 - Math.cos(a - half) * len); g.closePath(); g.fill();
      });
      g.restore();

      // Lightning: a bolt and a flash of the whole sky
      if (!still && t > nextStrike) { bolts = bolt(W * (0.15 + r() * 0.7), H, r); flash = 1; nextStrike = t + 3500 + r() * 6000; }
      if (flash > 0.02) {
        g.fillStyle = `rgba(255,235,230,${flash * 0.35})`; g.fillRect(0, 0, W, H);
        g.save(); g.strokeStyle = `rgba(255,245,240,${flash})`; g.shadowColor = '#fff'; g.shadowBlur = 18;
        bolts.forEach((p, i) => { g.lineWidth = i === bolts.length - 1 ? 2.6 : 1.2; g.beginPath(); p.forEach(([x, y], k) => k ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); });
        g.restore();
        flash *= flash > 0.6 && r() < 0.12 ? 1 : 0.8; // a flicker or two, then fade
      }

      // Three rows of buildings, the nearer the further they slide with the mouse, windows flickering
      layers.forEach(l => {
        const ox = -OVER - sway * OVER * l.depth;
        g.drawImage(l.img, ox, 0, l.img.width, H);
        l.wins.forEach(w => {
          if (!still && r() < 0.0004) w.on = !w.on;
          if (!w.on) return;
          const f = 0.55 + 0.45 * Math.sin(t / 300 + w.x * 0.37) * (w.warm > 0.9 ? 1 : 0.15);
          g.fillStyle = `rgba(255,${170 + w.warm * 60 | 0},${110 + w.warm * 50 | 0},${f})`;
          g.fillRect(w.x + ox, w.y, 3, 4);
        });
      });

      // Ground fog rolling along the street
      g.globalAlpha = 0.85; g.drawImage(streetFog, -((t / 35) % W), H * 0.45); g.globalAlpha = 1;

      // Rain: near drops are longer, faster and brighter; front-row drops splash on the roofs
      const wind = 1.2 + sway * 1.5, frontX = -OVER - sway * OVER;
      g.lineCap = 'round';
      drops.forEach(d => {
        const sp = (0.5 + d.z) * dt * 0.9;
        d.x += wind * sp * 0.12; d.y += sp;
        const floor = d.z > 0.85 ? roofs[Math.round(d.x - frontX)] || H : H * (0.6 + d.z * 0.4);
        if (d.y > floor) {
          if (d.z > 0.85 && !still) for (let k = 0; k < 3; k++) bits.push({ x: d.x, y: floor, vx: (r() - 0.5) * 1.6, vy: -1 - r() * 1.4, life: 1 });
          d.y = -10 - r() * 40; d.x = r() * (W + 40) - 40;
        }
        g.strokeStyle = `rgba(255,230,225,${0.1 + d.z * 0.3})`; g.lineWidth = d.z * 1.2;
        g.beginPath(); g.moveTo(d.x, d.y); g.lineTo(d.x - wind * d.z * 2, d.y - d.z * 16); g.stroke();
      });
      g.fillStyle = 'rgba(255,220,210,0.7)';
      bits = bits.filter(b => {
        b.x += b.vx; b.y += b.vy; b.vy += 0.12; b.life -= 0.05;
        g.globalAlpha = Math.max(0, b.life); g.fillRect(b.x, b.y, 1.2, 1.2);
        return b.life > 0;
      });
      g.globalAlpha = 1;

      if (!still && visible) raf = requestAnimationFrame(frame);
    };

    const start = () => { cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame); };
    const move = (e: PointerEvent) => { mx = e.clientX / innerWidth; my = e.clientY / innerHeight; };
    const resize = () => { setup(); if (still) frame(4000); };
    setup();
    still ? frame(4000) : start();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting && !document.hidden; if (visible && !still) start(); });
    io.observe(canvas);
    const onVis = () => { visible = !document.hidden; if (visible && !still) start(); };
    addEventListener('pointermove', move);
    addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      removeEventListener('pointermove', move); removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="city" />;
}

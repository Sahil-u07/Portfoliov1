import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks';

/** Small seeded random, so the moon and the ledge look the same on every visit. */
function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

type Bat = { x: number; y: number; vx: number; vy: number; z: number; phase: number };
type Ember = { x: number; y: number; v: number; life: number; size: number };

/** The moon's face drawn once: a red disc with darker craters and a lit rim. */
function moonTexture(R: number, r: () => number) {
  const c = document.createElement('canvas');
  c.width = c.height = R * 2;
  const g = c.getContext('2d')!;
  const face = g.createRadialGradient(R * 0.8, R * 0.7, R * 0.1, R, R, R);
  face.addColorStop(0, '#ff5a3c'); face.addColorStop(0.6, '#e01b12'); face.addColorStop(1, '#8a0606');
  g.fillStyle = face; g.beginPath(); g.arc(R, R, R, 0, Math.PI * 2); g.fill();
  g.save(); g.clip();
  for (let i = 0; i < 26; i++) {
    const x = r() * R * 2, y = r() * R * 2, s = R * (0.04 + r() * 0.16);
    const cr = g.createRadialGradient(x, y, 0, x, y, s);
    cr.addColorStop(0, 'rgba(90,0,0,0.45)'); cr.addColorStop(1, 'rgba(90,0,0,0)');
    g.fillStyle = cr; g.fillRect(x - s, y - s, s * 2, s * 2);
  }
  g.restore();
  return c;
}

/** Soft dark cloud bands that drift across the sky and over the moon. */
function cloudTexture(w: number, h: number, r: () => number) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d')!;
  for (let i = 0; i < 34; i++) {
    const x = r() * w, y = h * (0.3 + r() * 0.4), rad = h * (0.08 + r() * 0.2); // stays inside, so no hard edges
    const cl = g.createRadialGradient(x, y, 0, x, y, rad);
    cl.addColorStop(0, 'rgba(20,0,0,0.55)'); cl.addColorStop(1, 'rgba(20,0,0,0)');
    g.fillStyle = cl; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  return c;
}

/** A bat seen from below: body plus two wings that beat with `flap` (-1..1). */
function drawBat(g: CanvasRenderingContext2D, x: number, y: number, s: number, flap: number, tilt: number) {
  g.save(); g.translate(x, y); g.rotate(tilt); g.scale(s, s);
  const tip = -6 * flap; // wing tips swing up and down
  g.beginPath();
  g.moveTo(0, -2);
  g.quadraticCurveTo(-5, -3 + tip * 0.5, -11, tip);
  g.quadraticCurveTo(-8, 1 + tip * 0.3, -6, 2); g.quadraticCurveTo(-4, 1, -2, 3);
  g.lineTo(0, 2); g.lineTo(2, 3);
  g.quadraticCurveTo(4, 1, 6, 2); g.quadraticCurveTo(8, 1 + tip * 0.3, 11, tip);
  g.quadraticCurveTo(5, -3 + tip * 0.5, 0, -2);
  g.fill();
  g.beginPath(); g.ellipse(0, 0.5, 1.4, 2.6, 0, 0, Math.PI * 2); g.fill();
  g.restore();
}

/** A caped figure standing on the ledge, cape moving in the wind. */
function drawFigure(g: CanvasRenderingContext2D, x: number, ground: number, h: number, t: number) {
  const s = h / 60, wave = (k: number) => Math.sin(t / 420 + k) * 3 * s;
  g.save(); g.translate(x, ground);
  g.beginPath();
  g.moveTo(-3 * s, -52 * s); g.lineTo(-2.2 * s, -60 * s); g.lineTo(-0.8 * s, -55 * s); // left ear
  g.lineTo(0.8 * s, -55 * s); g.lineTo(2.2 * s, -60 * s); g.lineTo(3 * s, -52 * s);    // right ear
  g.quadraticCurveTo(4 * s, -47 * s, 6 * s, -45 * s);                                     // jaw to shoulder
  g.quadraticCurveTo(12 * s, -30 * s + wave(1), 16 * s + wave(2), 0);                     // cape, right edge
  g.lineTo(10 * s, -2 * s + wave(3)); g.lineTo(5 * s, wave(4) * 0.4); g.lineTo(0, -1 * s);
  g.lineTo(-5 * s, wave(5) * 0.4); g.lineTo(-10 * s, -2 * s + wave(6));
  g.lineTo(-16 * s + wave(7), 0);                                                         // cape, left edge
  g.quadraticCurveTo(-12 * s, -30 * s + wave(8), -6 * s, -45 * s);
  g.quadraticCurveTo(-4 * s, -47 * s, -3 * s, -52 * s);
  g.fill();
  g.restore();
}

/**
 * The live banner: a blood moon behind drifting clouds, a flock of bats that flies as a group, flees the
 * mouse and scatters on a click, embers rising from below, and a caped figure watching from a ledge.
 * It pauses when scrolled away and draws one still frame for visitors who prefer less motion.
 */
export default function NightBanner() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!, g = canvas.getContext('2d')!, r = rng(42);
    const still = prefersReducedMotion();
    let W = 0, H = 0, R = 0, moon: HTMLCanvasElement, clouds: HTMLCanvasElement, ledge: Path2D;
    let bats: Bat[] = [], embers: Ember[] = [];
    let mx = -999, my = -999, sway = 0, raf = 0, visible = true, last = 0;

    const setup = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      W = canvas.clientWidth; H = canvas.clientHeight; R = Math.round(H * 0.42);
      canvas.width = W * dpr; canvas.height = H * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      moon = moonTexture(R, rng(5));
      clouds = cloudTexture(W * 2, H, rng(9));
      // A gothic ledge along the bottom: uneven stone with a raised plinth on the left for the figure
      const lr = rng(13);
      ledge = new Path2D(); ledge.moveTo(0, H);
      for (let x = 0; x <= W + 20; x += 20 + lr() * 30) {
        const plinth = x > W * 0.14 && x < W * 0.3;
        ledge.lineTo(x, H - (plinth ? H * 0.2 : H * (0.06 + lr() * 0.06)));
      }
      ledge.lineTo(W, H); ledge.closePath();
      bats = Array.from({ length: Math.max(18, Math.round(W / 22)) }, () => ({
        x: r() * W, y: H * (0.15 + r() * 0.5), vx: 0.6 + r(), vy: (r() - 0.5) * 0.4, z: 0.5 + r() * 0.8, phase: r() * 6.28,
      }));
      embers = Array.from({ length: 50 }, () => ({ x: r() * W, y: r() * H, v: 0.2 + r() * 0.6, life: r(), size: 0.6 + r() * 1.6 }));
    };

    const scatter = (x: number, y: number) => bats.forEach(b => {
      const dx = b.x - x, dy = b.y - y, d = Math.hypot(dx, dy) || 1;
      b.vx += (dx / d) * 6; b.vy += (dy / d) * 6;
    });

    const frame = (t: number) => {
      const dt = Math.min(2.5, (t - (last || t)) / 16.7); last = t;
      sway += ((mx > -999 ? mx / W - 0.5 : 0) - sway) * 0.03;

      // Sky
      const sky = g.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#090000'); sky.addColorStop(0.6, '#3a0303'); sky.addColorStop(1, '#6e0a06');
      g.fillStyle = sky; g.fillRect(0, 0, W, H);

      // Blood moon with a slow breathing glow, nudged by the mouse for depth
      const cx = W * 0.72 - sway * 14, cy = H * 0.46, pulse = 1 + Math.sin(t / 1600) * 0.04;
      const glow = g.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 2.6 * pulse);
      glow.addColorStop(0, 'rgba(255,40,20,0.55)'); glow.addColorStop(1, 'rgba(255,40,20,0)');
      g.fillStyle = glow; g.fillRect(0, 0, W, H);
      g.drawImage(moon, cx - R, cy - R);

      // Clouds slide over the moon
      const off = -((t / 45) % W) - sway * 30;
      g.drawImage(clouds, off, 0); g.drawImage(clouds, off + W * 2, 0);

      // Bats: steer toward the flock, keep apart, wander, flee the mouse
      g.fillStyle = '#050000';
      bats.forEach(b => {
        if (!still) {
          let ax = 0, ay = 0, n = 0, cxm = 0, cym = 0;
          for (const o of bats) {
            if (o === b) continue;
            const dx = o.x - b.x, dy = o.y - b.y, d2 = dx * dx + dy * dy;
            if (d2 < 3600) { cxm += o.x; cym += o.y; ax += o.vx; ay += o.vy; n++; }
            if (d2 < 220) { b.vx -= dx * 0.004; b.vy -= dy * 0.004; }
          }
          if (n) { b.vx += ((cxm / n - b.x) * 0.0006 + (ax / n - b.vx) * 0.02); b.vy += ((cym / n - b.y) * 0.0006 + (ay / n - b.vy) * 0.02); }
          const fx = b.x - mx, fy = b.y - my, fd = Math.hypot(fx, fy);
          if (fd < 90) { b.vx += (fx / fd) * 0.35; b.vy += (fy / fd) * 0.35; }
          b.vx += 0.012 + Math.sin(t / 900 + b.phase) * 0.01; // drift right, with a little wander
          b.vy += Math.cos(t / 700 + b.phase * 2) * 0.012 + (H * 0.35 - b.y) * 0.0004;
          const sp = Math.hypot(b.vx, b.vy), max = 2.4 * b.z;
          if (sp > max) { b.vx *= max / sp; b.vy *= max / sp; }
          b.x += b.vx * dt; b.y += b.vy * dt;
          if (b.x > W + 20) b.x = -20; if (b.x < -20) b.x = W + 20;
          if (b.y < -10) b.vy += 0.3; if (b.y > H * 0.78) b.vy -= 0.3;
          b.phase += (0.28 + b.z * 0.1) * dt;
        }
        drawBat(g, b.x, b.y, b.z * 0.9, Math.sin(b.phase), Math.atan2(b.vy, Math.abs(b.vx) + 1) * 0.5);
      });

      // Embers drifting up from the street
      g.save(); g.globalCompositeOperation = 'lighter';
      embers.forEach(e => {
        if (!still) { e.y -= e.v * dt; e.x += Math.sin(t / 600 + e.size * 9) * 0.3; e.life -= 0.003 * dt; }
        if (e.y < 0 || e.life <= 0) { e.y = H + 4; e.x = r() * W; e.life = 1; }
        g.fillStyle = `rgba(255,${120 + e.size * 40 | 0},60,${Math.min(1, e.life) * 0.8})`;
        g.beginPath(); g.arc(e.x, e.y, e.size, 0, Math.PI * 2); g.fill();
      });
      g.restore();

      // The ledge and the figure on it
      g.fillStyle = '#030000'; g.fill(ledge);
      drawFigure(g, W * 0.22, H * 0.8 + 1, H * 0.5, t);

      if (!still && visible) raf = requestAnimationFrame(frame);
    };

    const start = () => { cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame); };
    const move = (e: PointerEvent) => { const b = canvas.getBoundingClientRect(); mx = (e.clientX - b.left) * W / b.width; my = (e.clientY - b.top) * H / b.height; };
    const click = (e: PointerEvent) => { move(e); scatter(mx, my); };
    const resize = () => { setup(); if (still) frame(4000); };
    setup();
    still ? frame(4000) : start();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting && !document.hidden; if (visible && !still) start(); });
    io.observe(canvas);
    const onVis = () => { visible = !document.hidden; if (visible && !still) start(); };
    addEventListener('pointermove', move);
    canvas.addEventListener('pointerdown', click);
    addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      removeEventListener('pointermove', move); canvas.removeEventListener('pointerdown', click);
      removeEventListener('resize', resize); document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="night" />;
}

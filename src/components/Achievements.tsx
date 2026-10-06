import { useEffect, useRef, useState } from 'react';
import { achievements } from '../data';
import { prefersReducedMotion, useReveal } from '../hooks';
import './Achievements.css';

/** Counts up to `to` once, the first time the card scrolls into view (easeOutQuart over 1.4s). */
function CountUp({ to }: { to: number }) {
  const [ref, shown] = useReveal<HTMLSpanElement>();
  const [n, setN] = useState(() => (prefersReducedMotion() ? to : 0));
  useEffect(() => {
    if (!shown || n === to) return;
    const start = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const t = Math.min((now - start) / 1400, 1);
      setN(Math.round(to * (1 - (1 - t) ** 4)));
      if (t < 1) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [shown, to]); // n is only read to skip a finished count, so it stays out of deps
  return <span ref={ref}>{n}</span>;
}

/**
 * A pinned horizontal gallery: the section is as tall as the screen plus the track's sideways travel,
 * and while its sticky stage is pinned, scrolling down slides the cards left.
 */
export default function Achievements() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const s = section.current!, t = track.current!;
    let travel = 0, raf = 0;
    const layout = () => {
      travel = Math.max(0, t.scrollWidth - t.clientWidth);
      s.style.height = `${innerHeight + travel}px`;
      update();
    };
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, -s.getBoundingClientRect().top / (s.offsetHeight - innerHeight || 1)));
      t.style.transform = `translateX(${-p * travel}px)`;
      bar.current!.style.transform = `scaleX(${p})`;
      // The card nearest the middle of the screen lifts.
      let best: Element | null = null, bestD = Infinity;
      for (const c of t.children) {
        const r = c.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - innerWidth / 2);
        if (d < bestD) { bestD = d; best = c; }
      }
      for (const c of t.children) c.classList.toggle('near', c === best);
    };
    const onScroll = () => { raf ||= requestAnimationFrame(update); };
    layout();
    addEventListener('resize', layout);
    addEventListener('scroll', onScroll, { passive: true });
    return () => { removeEventListener('resize', layout); removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="pinned" id="achievements" ref={section}>
      <div className="pin-stage">
        <div className="wrap pin-head">
          <div>
            <p className="kicker">Achievements</p>
            <h2>Proud <em>moments.</em></h2>
          </div>
          <span className="pin-progress" aria-hidden="true"><span ref={bar} /></span>
        </div>
        <ol className="ach-track" ref={track}>
          {achievements.map((a, i) => (
            <li key={a.label} className="ach">
              <div className="ach-top">
                <span className="ach-caption">{a.caption}</span>
                <span className="ach-index">{String(i + 1).padStart(2, '0')} / {String(achievements.length).padStart(2, '0')}</span>
              </div>
              <div className="ach-bottom">
                <div>
                  <h3>{a.label}</h3>
                  {a.detail && <p>{a.detail}</p>}
                </div>
                <b className="ach-num">{a.prefix && <small>{a.prefix}</small>}<CountUp to={a.value} />{a.suffix}</b>
              </div>
            </li>
          ))}
          <li className="ach-end"><em>and counting</em> →</li>
        </ol>
      </div>
    </section>
  );
}

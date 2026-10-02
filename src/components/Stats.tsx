import { useEffect, useState } from 'react';
import { stats } from '../data';
import { prefersReducedMotion, useReveal } from '../hooks';
import './Stats.css';

function CountUp({ to, run }: { to: number; run: boolean }) {
  const [n, setN] = useState(() => (prefersReducedMotion() ? to : 0));
  useEffect(() => {
    if (!run || n === to) return;
    const start = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const t = Math.min((now - start) / 900, 1);
      setN(Math.round(to * (1 - (1 - t) ** 3))); // ease-out cubic
      if (t < 1) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [run, to]); // n is only read to skip a finished count, so it stays out of deps
  return <>{n}</>;
}

export default function Stats() {
  const [ref, shown] = useReveal<HTMLElement>();
  return (
    <section ref={ref} className={`wrap stats reveal ${shown ? 'in' : ''}`} aria-label="Highlights">
      {stats.map(s => (
        <div key={s.label}>
          <b>{s.text ?? <><CountUp to={s.value!} run={shown} />{s.suffix}</>}</b>
          <span>{s.label}</span>
        </div>
      ))}
    </section>
  );
}

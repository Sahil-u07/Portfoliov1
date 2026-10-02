import { useEffect, useState } from 'react';
import { prefersReducedMotion, useReveal } from '../hooks';
import './Terminal.css';

const TERMINAL = `$ contributions --summary
Beehive     14+ PRs   security · CI · tests
Concore     12+ PRs merged
Diomede      3 PRs    DICOM routing
GNU Radio    2 PRs merged
$ _`;

export default function Terminal() {
  const [ref, shown] = useReveal<HTMLDivElement>();
  const [typed, setTyped] = useState(() => (prefersReducedMotion() ? TERMINAL.length : 0));
  useEffect(() => {
    if (!shown || typed >= TERMINAL.length) return;
    const t = setTimeout(() => setTyped(n => n + 2), 18);
    return () => clearTimeout(t);
  }, [shown, typed]);

  return (
    <div ref={ref} className="terminal" aria-label="Contribution summary">
      <div className="term-bar"><i /><i /><i /><span>~/sahil</span></div>
      <pre aria-hidden="true">
        <code>
          {TERMINAL.slice(0, typed).split('\n').map((line, i) => (
            <span key={i} className={line.startsWith('$') ? 'cmd' : undefined}>{line}{'\n'}</span>
          ))}
        </code>
      </pre>
      <p className="sr-only">{TERMINAL}</p>
    </div>
  );
}

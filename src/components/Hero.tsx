import { useEffect, useState } from 'react';
import { profile } from '../data';
import { prefersReducedMotion } from '../hooks';
import Icon from './Icon';
import './Hero.css';

const TERMINAL = `$ contributions --summary
Beehive     14+ PRs   security · CI · tests
Concore     12+ PRs merged
Diomede      3 PRs    DICOM routing
GNU Radio    2 PRs merged
$ _`;

function Terminal() {
  const [typed, setTyped] = useState(() => (prefersReducedMotion() ? TERMINAL.length : 0));
  useEffect(() => {
    if (typed >= TERMINAL.length) return;
    const t = setTimeout(() => setTyped(n => n + 2), 18);
    return () => clearTimeout(t);
  }, [typed]);

  return (
    <div className="terminal" aria-label="Contribution summary">
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

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <p className="kicker">{profile.tagline}</p>
          <h1>{profile.name}</h1>
          <p className="lede">{profile.intro}</p>
          <div className="cta-row">
            <a className="btn primary" href="#work">See EvidenceRAG <Icon name="down" /></a>
            <a className="btn" href={profile.github} target="_blank" rel="noopener"><Icon name="github" /> GitHub</a>
            <a className="btn" href={`mailto:${profile.email}`}><Icon name="mail" /> Email</a>
          </div>
        </div>
        <Terminal />
      </div>
    </section>
  );
}

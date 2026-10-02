import type { PointerEvent } from 'react';
import { openSource } from '../data';
import Icon from './Icon';
import Reveal from './Reveal';
import Terminal from './Terminal';
import './OpenSource.css';

// Card spotlight: follow the pointer with CSS variables instead of React state, so moving doesn't re-render.
const spotlight = (e: PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
};

export default function OpenSource() {
  return (
    <section className="wrap section" id="open-source">
      <div className="os-intro">
        <div>
          <p className="kicker">Open source</p>
          <h2>Contributions under real maintainer review</h2>
        </div>
        <Terminal />
      </div>
      <div className="grid">
        {openSource.map(p => (
          <Reveal as="article" key={p.name} className="card" onPointerMove={spotlight}>
            <header><h3>{p.name}</h3><span className="org">{p.org}</span></header>
            <p className="sub">{p.sub}</p>
            <p>{p.body[0]}</p>
            {p.severity && (
              <div className="sev" role="img" aria-label={`Vulnerabilities found: ${Object.entries(p.severity).map(([k, n]) => `${n} ${k}`).join(', ')}`}>
                {Object.entries(p.severity).map(([k, n]) => (
                  <span key={k} className={k.toLowerCase()} style={{ flex: n }}>{n} {k}</span>
                ))}
              </div>
            )}
            {p.body.slice(1).map(b => <p key={b}>{b}</p>)}
            {p.tags && <ul className="tags">{p.tags.map(t => <li key={t}>{t}</li>)}</ul>}
            <a className="more" href={p.url} target="_blank" rel="noopener">Repository <Icon name="arrow" /></a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

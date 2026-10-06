import type { CSSProperties } from 'react';
import { openSource } from '../data';
import { resetPointer, trackPointer } from '../hooks';
import Icon from './Icon';
import Reveal from './Reveal';
import Terminal from './Terminal';
import './OpenSource.css';

export default function OpenSource() {
  return (
    <section className="wrap section" id="open-source">
      <div className="os-intro">
        <div>
          <p className="kicker">Open source</p>
          <h2>100+ open-source <em>contributions.</em></h2>
        </div>
        <Terminal />
      </div>
      <div className="grid">
        {openSource.map((p, i) => (
          <Reveal as="article" key={p.name} className="card" onPointerMove={trackPointer} onPointerLeave={resetPointer} style={{ '--i': i % 2 } as CSSProperties}>
            <header><h3>{p.name}</h3><span className="org">{p.org}</span></header>
            <p className="sub">{p.sub}</p>
            <p>{p.body}</p>
            {p.tags && <ul className="tags">{p.tags.map(t => <li key={t}>{t}</li>)}</ul>}
            <a className="more" href={p.url} target="_blank" rel="noopener">Repository <Icon name="arrow" /></a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

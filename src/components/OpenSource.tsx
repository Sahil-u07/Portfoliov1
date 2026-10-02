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
          <h2>My open-source <em>work</em></h2>
        </div>
        <Terminal />
      </div>
      <div className="grid">
        {openSource.map((p, i) => (
          <Reveal as="article" key={p.name} className="card" onPointerMove={trackPointer} onPointerLeave={resetPointer} style={{ '--i': i % 2 } as CSSProperties}>
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
            <h4>Merged pull requests</h4>
            <ol className="prs">
              {p.prs.map(([ref, title]) => (
                <li key={ref}>
                  <a href={`${p.url}/${typeof ref === 'number' ? `pull/${ref}` : `commit/${ref}`}`} target="_blank" rel="noopener">
                    <code>{typeof ref === 'number' ? `#${ref}` : ref}</code>{title}
                  </a>
                </li>
              ))}
            </ol>
            {p.tags && <ul className="tags">{p.tags.map(t => <li key={t}>{t}</li>)}</ul>}
            <a className="more" href={p.url} target="_blank" rel="noopener">Repository <Icon name="arrow" /></a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

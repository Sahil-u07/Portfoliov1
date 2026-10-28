import type { CSSProperties } from 'react';
import { projects } from '../data';
import Icon from './Icon';

export default function Projects() {
  return (
    <section className="section" id="projects">
      <h2>Projects</h2>
      <ul className="grid">
        {projects.map((p, i) => (
          <li key={p.name} className="card project">
            {/* No screenshots yet, so each card gets a lettered cover in its own hue */}
            <div className="cover" style={{ '--h': 30 + i * 70 } as CSSProperties} aria-hidden="true"><span>{p.name}</span></div>
            <div className="project-body">
              <header><h3>{p.name}</h3><span className="status" data-status={p.status}>{p.status}</span></header>
              <p className="muted">{p.summary}</p>
              <ul className="tags">{p.tags.map(t => <li key={t}>{t}</li>)}</ul>
              <a className="btn small" href={p.href} target="_blank" rel="noopener">View Project <Icon name="arrow" /></a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

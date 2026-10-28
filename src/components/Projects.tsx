import type { CSSProperties } from 'react';
import { profile, projects } from '../data';
import Section, { ViewAll } from './Section';

const dot: Record<string, string> = { Live: 'live', Building: 'building' };

export default function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="projects">
        <ul className="grid">
          {projects.map((p, i) => (
            <li key={p.name}>
              <a className="project" href={p.href} target="_blank" rel="noopener">
                <div className="frame">
                  {/* A screenshot where there is one, otherwise the name on a tinted gradient */}
                  <div className="screen" style={{ '--h': 210 + i * 40 } as CSSProperties}>
                    {p.image ? <img src={`${import.meta.env.BASE_URL}projects/${p.image}`} alt={`Screenshot of ${p.name}`} loading="lazy" /> : <span aria-hidden="true">{p.name}</span>}
                  </div>
                </div>
                <div className="project-head"><h3>{p.name}</h3><span className="status"><i className={dot[p.status] ?? 'live'} />{p.status}</span></div>
                <p className="project-text">{p.summary}</p>
                <div className="project-foot">
                  <ul className="tags">{p.tags.map(t => <li key={t}>{t}</li>)}</ul>
                  <span className="view">View Project <svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7" /></svg></span>
                </div>
              </a>
            </li>
          ))}
        </ul>
        <ViewAll href={`${profile.github}?tab=repositories`} />
      </div>
    </Section>
  );
}

import { projects } from '../data';
import Icon from './Icon';
import Reveal from './Reveal';
import './Projects.css';

export default function Projects() {
  return (
    <section className="wrap section" id="projects">
      <p className="kicker">Projects</p>
      <h2>Things I've built</h2>
      <div className="projects">
        {projects.map((p, i) => (
          <Reveal as="article" key={p.name} className="project">
            <div className="project-top">
              <span className="project-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="project-kind">{p.kind}</span>
            </div>
            <h3>{p.name}</h3>
            <p>{p.summary}</p>
            <ul className="highlights">{p.highlights.map(h => <li key={h}>{h}</li>)}</ul>
            <ul className="tags">{p.tags.map(t => <li key={t}>{t}</li>)}</ul>
            <div className="project-links">
              {p.links.map(l => {
                const external = l.href.startsWith('http');
                return (
                  <a key={l.label} href={l.href} {...(external && { target: '_blank', rel: 'noopener' })}>
                    {l.label} <Icon name={external ? 'arrow' : 'down'} />
                  </a>
                );
              })}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

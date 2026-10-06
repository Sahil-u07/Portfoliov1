import { useState } from 'react';
import { projects } from '../data';
import Icon from './Icon';
import './Projects.css';

const pad = (i: number) => String(i + 1).padStart(2, '0');

export default function Projects() {
  const [open, setOpen] = useState(0);
  return (
    <section className="wrap section" id="projects">
      <p className="kicker">Selected work</p>
      <h2>Things I've <em>built.</em></h2>
      {/* One tall panel per project; the open one widens and the rest fold into slim spines. */}
      <div className="gallery">
        {projects.map((p, i) => (
          <article key={p.name} className={`project ${open === i ? 'open' : ''}`} onPointerEnter={e => e.pointerType === 'mouse' && setOpen(i)}>
            <button type="button" className="spine" aria-expanded={open === i} aria-controls={`project-${i}`} onClick={() => setOpen(i)} onFocus={() => setOpen(i)}>
              <span className="project-index">{pad(i)}</span>
              <span className="spine-title">{p.name}</span>
              <span className="plus" aria-hidden="true">+</span>
            </button>
            <div className="project-body" id={`project-${i}`}>
              <div className="project-info">
                <p className="project-kind">{pad(i)} · {p.kind}</p>
                <h3>{p.name}</h3>
                <p>{p.summary}</p>
                <ul className="highlights">{p.highlights.map(h => <li key={h}>{h}</li>)}</ul>
                <ul className="tags">{p.tags.map(t => <li key={t}>{t}</li>)}</ul>
                <div className="project-links">
                  {p.links.map((l, j) => {
                    const external = l.href.startsWith('http');
                    return (
                      <a key={l.label} className={`btn ${j === 0 ? 'primary' : ''}`} href={l.href} {...(external && { target: '_blank', rel: 'noopener' })}>
                        {l.label} <Icon name={external ? 'arrow' : 'down'} />
                      </a>
                    );
                  })}
                </div>
              </div>
              {/* A grayscale wireframe, labelled so nobody mistakes it for a screenshot */}
              <figure className="mini-ui" aria-hidden="true">
                <div className="mini-bar"><i /><i /><i /><span>{p.name}</span></div>
                <div className="mini-main">
                  <span className="mini-line w60" /><span className="mini-line w90" /><span className="mini-line w75" />
                  <div className="mini-cards"><span /><span /><span /></div>
                  <span className="mini-line w40" />
                </div>
                <figcaption>Illustrative UI</figcaption>
              </figure>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

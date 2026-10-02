import type { CSSProperties } from 'react';
import { about } from '../data';
import Reveal from './Reveal';
import './About.css';

export default function About() {
  return (
    <section className="wrap section" id="about">
      <p className="kicker">Introduction</p>
      <h2>A quick <em>overview</em></h2>
      <div className="about">
        <Reveal className="about-text">{about.paragraphs.map(p => <p key={p}>{p}</p>)}</Reveal>
        <Reveal as="dl" className="facts" style={{ '--i': 1 } as CSSProperties}>
          {about.facts.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
        </Reveal>
      </div>
    </section>
  );
}

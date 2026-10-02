import { experience } from '../data';
import Reveal from './Reveal';
import './Experience.css';

export default function Experience() {
  return (
    <section className="wrap section" id="experience">
      <p className="kicker">Experience</p>
      <h2>Where I've <em>shipped</em></h2>
      <ol className="timeline">
        {experience.map(x => (
          <Reveal as="li" key={x.role}>
            <time>{x.when}</time>
            <h3>{x.role} <span>{x.org}</span></h3>
            <p className="sub">{x.sub}</p>
            {x.points.length > 0 && <ul>{x.points.map(p => <li key={p}>{p}</li>)}</ul>}
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

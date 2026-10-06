import { experience } from '../data';
import Reveal from './Reveal';
import './Experience.css';

export default function Experience() {
  return (
    <section className="wrap section" id="experience">
      <p className="kicker">Path so far</p>
      <h2>Education & <em>experience.</em></h2>
      <ol className="timeline">
        {experience.map(x => (
          <Reveal as="li" key={x.role}>
            <time>{x.when}</time>
            <h3>{x.role} <span>{x.org}</span></h3>
            <p className="sub">{x.sub}</p>
            {x.points.length > 0 && <ul>{x.points.map(p => <li key={p}>{p}</li>)}</ul>}
          </Reveal>
        ))}
        <Reveal as="li" className="next"><time>Next</time><h3>Your <em>team?</em></h3></Reveal>
      </ol>
    </section>
  );
}

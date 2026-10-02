import { evidenceRag } from '../data';
import Benchmark from './Benchmark';
import Icon from './Icon';
import Pipeline from './Pipeline';
import Reveal from './Reveal';
import './EvidenceRag.css';

export default function EvidenceRag() {
  return (
    <section className="wrap section" id="work">
      <p className="kicker">Featured project</p>
      <Reveal className="feature">
        <div className="feature-head">
          <div>
            <h2>EvidenceRAG</h2>
            <p className="motto">{evidenceRag.motto}</p>
            <p>{evidenceRag.summary}</p>
            <ul className="tags">{evidenceRag.tags.map(t => <li key={t}>{t}</li>)}</ul>
          </div>
          <a className="btn" href={evidenceRag.repo} target="_blank" rel="noopener"><Icon name="github" /> View source</a>
        </div>
        <Pipeline />
        <Benchmark />
      </Reveal>
    </section>
  );
}

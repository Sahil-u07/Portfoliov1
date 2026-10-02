import { evidenceRag } from '../data';
import Benchmark from './Benchmark';
import Icon from './Icon';
import Pipeline from './Pipeline';
import Reveal from './Reveal';
import RetrievalField from './RetrievalField';
import './EvidenceRag.css';

export default function EvidenceRag() {
  return (
    <section className="wrap section" id="evidencerag">
      <p className="kicker">Deep dive</p>
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
        <div className="how">
          <div>
            <h3>How it finds evidence</h3>
            <p>Every dot is a small chunk of a document, and chunks about the same topic end up close together. The ring is a question. The search just grabs the five chunks closest to it, numbered from closest to farthest, and only those get used to write the answer.</p>
          </div>
          <RetrievalField />
        </div>
        <Pipeline />
        <Benchmark />
      </Reveal>
    </section>
  );
}

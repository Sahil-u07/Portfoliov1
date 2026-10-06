import { useState, type CSSProperties } from 'react';
import { evidenceRag, openSource, projects, skills } from '../data';
import { useReveal } from '../hooks';
import './Skills.css';

const COLS = 8;
const families = Object.keys(skills);
const key = (s: string) => s.toLowerCase().replace(/\.js$|\s*\(.*\)/g, '');

// Where each skill shows up: every project and open-source repo whose tags mention it.
const used = [
  ...projects.map(p => ({ name: p.name, tags: p.tags })),
  { name: 'EvidenceRAG', tags: evidenceRag.tags },
  ...openSource.map(p => ({ name: p.name, tags: p.tags })),
];

// Element symbols: the name's capitals (JavaScript → Js) or first two letters, never repeating one.
const taken = new Set<string>();
function symbol(name: string) {
  const letters = name.replace(/\(.*\)|[^A-Za-z]/g, '');
  const caps = letters.replace(/[^A-Z]/g, '');
  const tries = [caps.length > 1 ? caps.slice(0, 2) : letters.slice(0, 2), ...[...letters.slice(1)].map(c => letters[0] + c)];
  const sym = tries.map(t => t[0].toUpperCase() + t.slice(1).toLowerCase()).find(t => !taken.has(t)) ?? letters[0];
  taken.add(sym);
  return sym;
}

const elements = families.flatMap(family => skills[family].map(name => ({ name, family }))).map((e, i) => ({
  ...e, n: i + 1, sym: symbol(e.name),
  projects: [...new Set(used.filter(u => u.tags.some(t => key(t) === key(e.name))).map(u => u.name))],
}));

export default function Skills() {
  const [family, setFamily] = useState('All');
  const [picked, setPicked] = useState(elements[0]);
  const [ref, shown] = useReveal<HTMLOListElement>();
  return (
    <section className="wrap section" id="skills">
      <p className="kicker">Skills</p>
      <h2>The periodic table <em>of my stack.</em></h2>
      <div className="toggles" role="group" aria-label="Highlight a family of skills">
        {['All', ...families].map(f => (
          <button key={f} type="button" className="toggle-btn" aria-pressed={f === family} onClick={() => setFamily(f)}>{f}</button>
        ))}
      </div>
      <div className="table">
        <ol ref={ref} className={`elements ${shown ? 'in' : ''}`}>
          {elements.map((e, i) => (
            <li key={e.name} className={`element ${family !== 'All' && e.family !== family ? 'dim' : ''} ${picked === e ? 'picked' : ''}`}
              style={{ '--d': `${(Math.floor(i / COLS) + (i % COLS)) * 40}ms` } as CSSProperties}>
              <button type="button" onPointerEnter={() => setPicked(e)} onFocus={() => setPicked(e)} onClick={() => setPicked(e)}>
                <small>{e.n}</small>
                <b aria-hidden="true">{e.sym}</b>
                <span>{e.name}</span>
              </button>
            </li>
          ))}
        </ol>
        <aside className="inspector" aria-live="polite">
          <b key={picked.sym} className="big" aria-hidden="true">{picked.sym}</b>
          <small>No. {picked.n} · {picked.family}</small>
          <h3>{picked.name}</h3>
          {picked.projects.length > 0
            ? <p>Used in {picked.projects.join(', ')}.</p>
            : <p>Part of my everyday toolkit.</p>}
        </aside>
      </div>

    </section>
  );
}

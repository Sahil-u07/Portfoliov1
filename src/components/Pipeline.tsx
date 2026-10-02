import { useEffect, useRef, useState } from 'react';
import { evidenceRag } from '../data';
import { prefersReducedMotion } from '../hooks';
import Icon from './Icon';

type Status = '' | 'active' | 'done' | 'halt';
type Verdict = { state: 'idle' | 'running' | 'verified' | 'abstained'; text: string };

// The query path. Ingest and index already ran at upload time; dense and BM25 run side by side.
// Timings are the README's warm-run, CPU-only numbers.
const STEPS: [number[], string][] = [
  [[2, 3], 'retrieving…'],
  [[4], 'fusing ranks…'],
  [[5], 'reranking…  retrieval ~1.0 s'],
  [[6], 'generating…  ~2.8 s'],
  [[7], 'verifying…  ~0.1 s'],
];
const { stages } = evidenceRag;

export default function Pipeline() {
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<Status[]>(() => stages.map(() => ''));
  const [sufficient, setSufficient] = useState(true);
  const [running, setRunning] = useState(false);
  const [verdict, setVerdict] = useState<Verdict>({ state: 'idle', text: '' });
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, prefersReducedMotion() ? 0 : ms));

  async function run() {
    setRunning(true);
    const s: Status[] = stages.map((_, i) => (i < 2 ? 'done' : ''));
    for (const [ids, msg] of STEPS) {
      ids.forEach(i => (s[i] = 'active'));
      setStatus([...s]); setSelected(ids.at(-1)!); setVerdict({ state: 'running', text: msg });
      await sleep(650);
      if (!alive.current) return;
      ids.forEach(i => (s[i] = 'done'));
    }
    if (!sufficient) s[7] = 'halt';
    setStatus(s);
    setVerdict(sufficient
      ? { state: 'verified', text: 'Verified answer with [Evidence N] citations. Total ~3.9 s.' }
      : { state: 'abstained', text: "Abstained: the evidence can't support an answer, so it says so instead of guessing." });
    setRunning(false);
  }

  return (
    <div className="demo">
      <div className="demo-head">
        <h3>Try the pipeline</h3>
        <div className="demo-controls">
          <button className="switch" type="button" role="switch" aria-checked={sufficient} disabled={running}
            onClick={() => setSufficient(v => !v)}>
            <span className="knob" />Evidence: {sufficient ? 'sufficient' : 'insufficient'}
          </button>
          <button className="btn primary" type="button" onClick={run} disabled={running}>
            <Icon name="play" /> Run query
          </button>
        </div>
      </div>
      <p className="query"><span>Query</span> <code>"What is BM25?"</code></p>
      <ol className="pipeline" aria-label="Pipeline stages, select one for details">
        {stages.map((st, i) => (
          <li key={st.name}>
            <button type="button" className={`stage ${status[i]} ${selected === i ? 'selected' : ''}`}
              aria-pressed={selected === i} onClick={() => setSelected(i)}>
              <small>{String(i + 1).padStart(2, '0')}</small>{st.name}
            </button>
          </li>
        ))}
      </ol>
      <div className="demo-out">
        <p className="stage-detail" aria-live="polite">
          {selected === null
            ? 'Select a stage to see what it does, or run a query to watch the request flow through it.'
            : <><b>{stages[selected].name}.</b> {stages[selected].detail}</>}
        </p>
        <p className="verdict" data-state={verdict.state} aria-live="polite">
          {verdict.state === 'verified' && <Icon name="check" />}
          {verdict.state === 'abstained' && <Icon name="x" />}
          {verdict.text}
        </p>
      </div>
      <p className="note">A visual walkthrough, not a live backend. Timings are the warm-run, CPU-only numbers from the project README.</p>
    </div>
  );
}

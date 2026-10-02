import { useState } from 'react';
import { evidenceRag, type Metric } from '../data';

const { metrics, benchmark } = evidenceRag;
const rows = Object.entries(benchmark);

export default function Benchmark() {
  const [metric, setMetric] = useState<Metric>('mrr');
  const best = Math.max(...rows.map(([, r]) => r[metric]));
  return (
    <div className="eval">
      <div className="demo-head">
        <h3>Retrieval benchmark</h3>
        <div className="toggles" role="group" aria-label="Metric">
          {(Object.keys(metrics) as Metric[]).map(m => (
            <button key={m} type="button" className="toggle-btn" aria-pressed={m === metric} onClick={() => setMetric(m)}>
              {metrics[m]}
            </button>
          ))}
        </div>
      </div>
      <div className="bars">
        {rows.map(([name, r]) => (
          <div key={name} className={`bar ${r[metric] === best ? 'best' : ''}`}>
            <span className="name">{name}</span>
            <span className="track"><span className="fill" style={{ width: `${r[metric] * 100}%` }} /></span>
            <span className="val">{r[metric].toFixed(3)}</span>
          </div>
        ))}
      </div>
      <p className="note">20-question controlled benchmark. Differences of a few points are within noise, so it works as a regression harness rather than a leaderboard.</p>
    </div>
  );
}

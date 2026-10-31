import { useEffect, useState } from 'react';
import { profile } from '../data';
import Section from './Section';

type Day = { date: string; count: number; level: number };
// Public mirror of the GitHub contribution graph; GitHub's own API needs a token.
export const activityUrl = `https://github-contributions-api.jogruber.de/v4/${profile.githubUser}?y=last`;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function GithubActivity() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    fetch(activityUrl)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((d: { contributions: Day[] }) => setDays(d.contributions))
      .catch(() => setFailed(true));
  }, []);

  const total = days?.reduce((n, d) => n + d.count, 0) ?? 0;
  // One column per Sunday-to-Saturday week; the first column is padded up to the first day's weekday.
  const pad = days?.length ? new Date(days[0].date).getUTCDay() : 0;
  const weeks: (Day | null)[][] = [];
  days?.forEach((d, i) => { const w = Math.floor((i + pad) / 7); (weeks[w] ??= Array(i === 0 ? pad : 0).fill(null)).push(d); });
  // Month names in order, starting from the month the year begins in.
  const first = days?.length ? new Date(days[0].date).getUTCMonth() : 0;
  const months = Array.from({ length: 12 }, (_, i) => MONTHS[(first + i) % 12]);
  const summary = `${total} GitHub activities in the last year`;
  const nice = (d: string) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${d}T00:00:00`));

  return (
    <Section id="activity" title="GitHub Activity" aside={<p className="sec-note" aria-live="polite">{days ? summary : 'Loading GitHub contribution activity'}</p>}>
      <div className="activity">
        {failed ? (
          <p className="muted">Couldn't load the activity graph right now. It's all on <a className="link" href={profile.github}>my GitHub profile</a>.</p>
        ) : !days ? (
          <>
            <div className="months" aria-hidden="true">{MONTHS.map(m => <span key={m}>{m}</span>)}</div>
            {/* Pulsing empty grid while the data loads */}
            <div className="heat loading" aria-hidden="true" style={{ gridTemplateColumns: 'repeat(53, minmax(0, 1fr))' }}>
              {Array.from({ length: 53 }, (_, i) => <div key={i}>{Array.from({ length: 7 }, (_, j) => <i key={j} />)}</div>)}
            </div>
          </>
        ) : (
          <>
            <div className="months" aria-hidden="true">{months.map(m => <span key={m}>{m}</span>)}</div>
            <div className="heat" role="img" aria-label={summary} style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
              {weeks.map((w, i) => (
                <div key={i}>{w.map((d, j) => d ? <i key={d.date} data-level={d.level} onMouseEnter={e => { const r = e.currentTarget.getBoundingClientRect(), z = parseFloat(getComputedStyle(document.documentElement).zoom) || 1; setTip({ text: `${d.count} contributions on ${nice(d.date)}`, x: (r.left + r.width / 2) / z, y: r.top / z }); }} onMouseLeave={() => setTip(null)} /> : <i key={j} className="blank" />)}</div>
              ))}
            </div>
            {tip && <div className="heat-tip" style={{ left: tip.x, top: tip.y }}>{tip.text}</div>}
            <div className="legend"><span>Less active</span><span>{[0, 1, 2, 3, 4].map(l => <i key={l} data-level={l} />)} More active</span></div>
          </>
        )}
      </div>
    </Section>
  );
}

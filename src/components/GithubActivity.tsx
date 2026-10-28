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
  const summary = `${total} GitHub contributions in the last year`;

  return (
    <Section id="activity" title="GitHub Activity" aside={days && <p className="sec-note" aria-live="polite">{summary}</p>}>
      <div className="activity">
        {failed ? (
          <p className="muted">Couldn't load the activity graph right now. It's all on <a className="link" href={profile.github}>my GitHub profile</a>.</p>
        ) : !days ? (
          <p className="muted" aria-live="polite">Loading GitHub contribution activity…</p>
        ) : (
          <>
            <div className="months" aria-hidden="true">{months.map(m => <span key={m}>{m}</span>)}</div>
            <div className="heat" role="img" aria-label={summary} style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
              {weeks.map((w, i) => (
                <div key={i}>{w.map((d, j) => d ? <i key={d.date} data-level={d.level} title={`${d.count} contributions on ${d.date}`} /> : <i key={j} className="blank" />)}</div>
              ))}
            </div>
            <div className="legend"><span>Less active</span><span>{[0, 1, 2, 3, 4].map(l => <i key={l} data-level={l} />)} More active</span></div>
          </>
        )}
      </div>
    </Section>
  );
}

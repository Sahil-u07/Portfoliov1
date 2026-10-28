import { useEffect, useState } from 'react';
import { profile } from '../data';

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
  // Pad the first column so each column is one Sunday-to-Saturday week.
  const pad = days?.length ? new Date(days[0].date).getUTCDay() : 0;
  const weeks = days ? Math.ceil((pad + days.length) / 7) : 0;
  // A month label sits over the first column that starts in that month.
  const labels = days ? Array.from({ length: weeks }, (_, w) => {
    const d = days[Math.max(0, w * 7 - pad)];
    const prev = w > 0 ? days[Math.max(0, (w - 1) * 7 - pad)] : null;
    const m = new Date(d.date).getUTCMonth();
    return !prev || new Date(prev.date).getUTCMonth() !== m ? MONTHS[m] : '';
  }) : [];

  return (
    <section className="section" id="activity">
      <h2>GitHub Activity</h2>
      {failed ? (
        <p className="muted">Couldn't load the activity graph right now. It's all on <a href={profile.github}>my GitHub profile</a>.</p>
      ) : !days ? (
        <p className="muted" aria-live="polite">Loading GitHub contribution activity…</p>
      ) : (
        <div className="card activity">
          <p className="muted"><b>{total}</b> contributions in the last year</p>
          <div className="heat-scroll">
            <div className="heat" style={{ gridTemplateColumns: `repeat(${weeks}, var(--cell))` }}>
              {labels.map((l, w) => <span key={w} className="month">{l}</span>)}
              <div className="cells" style={{ gridColumn: `1 / span ${weeks}` }}>
                {Array.from({ length: pad }, (_, i) => <i key={`p${i}`} className="blank" />)}
                {days.map(d => <i key={d.date} data-level={d.level} title={`${d.count} on ${d.date}`} />)}
              </div>
            </div>
          </div>
          <p className="legend muted">Less active {[0, 1, 2, 3, 4].map(l => <i key={l} data-level={l} />)} More active</p>
        </div>
      )}
    </section>
  );
}

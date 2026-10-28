import { experience } from '../data';

export default function Experience() {
  return (
    <section className="section" id="experience">
      <h2>Experiences</h2>
      <ol className="stack">
        {experience.map(x => (
          <li key={x.org} className="card xp">
            <header>
              <span className="logo" aria-hidden="true">{x.org.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
              <div>
                <h3>{x.org}</h3>
                <p className="muted">{x.role}</p>
              </div>
              <p className="when">{x.when}<span>{x.sub}</span></p>
            </header>
            {x.stats.length > 0 && (
              <dl className="stats">
                {x.stats.map(s => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}
              </dl>
            )}
            {x.points.length > 0 && <ul className="points">{x.points.map(p => <li key={p}>{p}</li>)}</ul>}
            {x.tags.length > 0 && <ul className="tags">{x.tags.map(t => <li key={t}>{t}</li>)}</ul>}
          </li>
        ))}
      </ol>
    </section>
  );
}

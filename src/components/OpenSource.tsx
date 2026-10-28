import { openSource } from '../data';
import Icon from './Icon';

const max = Math.max(...openSource.map(p => p.count));

export default function OpenSource() {
  return (
    <section className="section" id="open-source">
      <h2>Open Source Contributions</h2>
      <p className="muted lead"><b>100+</b> contributions across four projects.</p>
      <ul className="stack">
        {openSource.map(p => (
          <li key={p.name} className="card os">
            <header>
              <h3>{p.name}</h3><span className="muted">{p.org}</span>
              <a className="more" href={p.url} target="_blank" rel="noopener" aria-label={`${p.name} repository`}><Icon name="arrow" /></a>
            </header>
            <p className="muted">{p.body}</p>
            <div className="bar" role="img" aria-label={p.sub}>
              <i style={{ width: `${(p.count / max) * 100}%` }} />
              <span>{p.count ? `${p.count}+` : 'counting…'}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

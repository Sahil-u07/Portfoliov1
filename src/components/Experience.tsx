import { useState } from 'react';
import { experience, profile } from '../data';
import Icon from './Icon';
import Section, { ViewAll } from './Section';

export default function Experience() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Section id="experience" title="Experiences">
      <ol>
        {experience.map(x => {
          const isOpen = open === x.org;
          const hasMore = x.points.length + x.stats.length + x.tags.length > 0;
          return (
            <li key={x.org} className="xp rule-bottom">
              <button className="xp-row" type="button" aria-expanded={isOpen} disabled={!hasMore} onClick={() => setOpen(isOpen ? null : x.org)}>
                <span className="logo" aria-hidden="true"><span><img src={`${import.meta.env.BASE_URL}logos/${x.logo}`} alt="" /></span></span>
                <span className="xp-title"><b>{x.org}</b><span>{x.role}</span></span>
                <span className="xp-when"><span>{x.when}{hasMore && <Icon name="chevron" />}</span><span>{x.sub}</span></span>
              </button>
              <div className={`fold ${isOpen ? 'open' : ''}`}>
                <div>
                  <div className="xp-body">
                    {x.stats.length > 0 && (
                      <dl className="stats">{x.stats.map(s => <div key={s.label}><dd>{s.value}</dd><dt>{s.label}</dt></div>)}</dl>
                    )}
                    {x.points.length > 0 && <ul className="points">{x.points.map(p => <li key={p}><span>•</span><span>{p}</span></li>)}</ul>}
                    {x.tags.length > 0 && <ul className="tags">{x.tags.map(t => <li key={t}>{t}</li>)}</ul>}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <ViewAll href={profile.linkedin} />
    </Section>
  );
}

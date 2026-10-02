import { useState } from 'react';
import { achievements, skills } from '../data';
import Reveal from './Reveal';
import './Skills.css';

const groups = ['All', ...Object.keys(skills)];

export default function Skills() {
  const [group, setGroup] = useState('All');
  const shown = group === 'All' ? Object.values(skills).flat() : skills[group];
  return (
    <section className="wrap section" id="skills">
      <p className="kicker">Skills</p>
      <h2>My <em>toolbox</em></h2>
      <div className="toggles" role="group" aria-label="Filter skills">
        {groups.map(g => (
          <button key={g} type="button" className="toggle-btn" aria-pressed={g === group} onClick={() => setGroup(g)}>{g}</button>
        ))}
      </div>
      {/* key on the list replays the pop-in animation each time the filter changes */}
      <ul className="chips" key={group}>
        {shown.map((s, i) => <li key={s} className="chip" style={{ animationDelay: `${i * 25}ms` }}>{s}</li>)}
      </ul>

      <h2 className="ach-title">Achievements</h2>
      <ul className="achievements">
        {achievements.map(a => (
          <Reveal as="li" key={a.title}><b>{a.title}</b><span>{a.body}</span></Reveal>
        ))}
      </ul>
    </section>
  );
}

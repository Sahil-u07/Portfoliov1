import { skills } from '../data';

export default function Skills() {
  return (
    <section className="section" id="skills">
      <h2>Skills &amp; Technologies</h2>
      {Object.entries(skills).map(([group, list]) => (
        <div key={group} className="skill-group">
          <h3>{group}</h3>
          <ul className="chips">{list.map(s => <li key={s}>{s}</li>)}</ul>
        </div>
      ))}
    </section>
  );
}

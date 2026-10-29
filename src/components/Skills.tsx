import { skills } from '../data';
import { techIcons } from '../techIcons';
import Section from './Section';

export default function Skills() {
  return (
    <Section id="skills" title="Skills & Technologies">
      <ul className="skills">
        {Object.values(skills).flat().map(s => (
          <li key={s}>{techIcons[s] && <svg viewBox="0 0 24 24" aria-hidden="true"><path d={techIcons[s]} /></svg>}{s}</li>
        ))}
      </ul>
    </Section>
  );
}

import { skills } from '../data';
import Section from './Section';

export default function Skills() {
  return (
    <Section id="skills" title="Skills & Technologies">
      <ul className="skills">{Object.values(skills).flat().map(s => <li key={s}>{s}</li>)}</ul>
    </Section>
  );
}

import { highlights } from '../data';
import Section from './Section';

const Card = ({ h, copy }: { h: (typeof highlights)[number]; copy?: boolean }) => (
  <li className="hl ring" aria-hidden={copy || undefined}>
    <div className="hl-card">
      <div className="hl-art"><b>{h.value}</b></div>
      <div className="hl-text"><span className="pill">{h.label}</span><p>{h.caption}</p></div>
    </div>
  </li>
);

/** A slow marquee; the list is drawn twice so the loop has no seam, and the copy is hidden from screen readers. */
export default function Highlights() {
  return (
    <Section id="highlights" title="Highlights">
      <div className="marquee">
        <ul className="track">
          {highlights.map(h => <Card key={h.label} h={h} />)}
          {highlights.map(h => <Card key={`${h.label}-copy`} h={h} copy />)}
        </ul>
      </div>
    </Section>
  );
}

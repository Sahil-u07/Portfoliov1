import { highlights } from '../data';

const Card = ({ h }: { h: (typeof highlights)[number] }) => (
  <li className="card hl"><b>{h.value}</b><h3>{h.label}</h3><p className="muted">{h.caption}</p></li>
);

/** A slow marquee; the list is drawn twice so the loop has no seam, and the copy is hidden from screen readers. */
export default function Highlights() {
  return (
    <section className="section" id="highlights">
      <h2>Highlights</h2>
      <div className="marquee">
        <ul>{highlights.map(h => <Card key={h.label} h={h} />)}</ul>
        <ul aria-hidden="true">{highlights.map(h => <Card key={h.label} h={h} />)}</ul>
      </div>
    </section>
  );
}

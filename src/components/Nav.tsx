import { sections } from '../data';
import { useActiveSection } from '../hooks';
import './Nav.css';

const ids = sections.map(s => s.id);

export default function Nav({ children }: { children?: React.ReactNode }) {
  const active = useActiveSection(ids);
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="logo" href="#top" aria-label="Sahil Lenka, back to top">SL<span>.</span></a>
        <nav aria-label="Sections">
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'current' : undefined}>{s.label}</a>
          ))}
        </nav>
        {children}
      </div>
    </header>
  );
}

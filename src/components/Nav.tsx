import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { profile, sections } from '../data';
import { useActiveSection } from '../hooks';
import './Nav.css';

const ids = sections.map(s => s.id);
const initials = profile.name.split(' ').map(w => w[0]).join('');

export default function Nav({ children }: { children?: React.ReactNode }) {
  const active = useActiveSection(ids);
  const [scrolled, setScrolled] = useState(false);
  const [pill, setPill] = useState<CSSProperties>({ opacity: 0 });
  const links = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 40);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  // The ink pill slides under whichever link is active.
  useEffect(() => {
    const a = links.current?.querySelector<HTMLElement>('.current');
    setPill(a ? { opacity: 1, width: a.offsetWidth, transform: `translateX(${a.offsetLeft}px)` } : { opacity: 0 });
  }, [active]);

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <a className="logo" href="#top" aria-label={`${profile.name}, back to top`}>
          <span className="mark">{initials}</span><span className="logo-name">{profile.name}</span>
        </a>
        <nav aria-label="Sections" ref={links}>
          <span className="pill" style={pill} aria-hidden="true" />
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'current' : undefined}>{s.label}</a>
          ))}
        </nav>
        {children}
      </div>
    </header>
  );
}

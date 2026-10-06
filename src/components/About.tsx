import { useEffect, useRef, useState, type CSSProperties } from 'react';
import photo from '../assets/sahil.webp';
import { about, profile } from '../data';
import { prefersReducedMotion } from '../hooks';
import Icon from './Icon';
import Reveal from './Reveal';
import './About.css';

/**
 * An ID card hanging from a lanyard. It swings like a damped pendulum when the pointer moves past it,
 * sways a little when idle, and flips over on hover, tap, Enter or Space.
 */
function IdCard() {
  const hanger = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const el = hanger.current!;
    if (prefersReducedMotion()) return;
    let angle = 0, speed = 0, lastX = 0, raf = 0, visible = false;
    const section = el.closest('section')!;
    const onMove = (e: PointerEvent) => {
      if (lastX) speed += Math.max(-1.5, Math.min(1.5, (e.clientX - lastX) * 0.04)); // pointer velocity kicks the swing
      lastX = e.clientX;
    };
    const tick = (t: number) => {
      speed += -0.02 * angle - 0.06 * speed; // spring back toward rest, with damping
      angle += speed;
      el.style.transform = `rotate(${angle + Math.sin(t / 1100) * 1.2}deg)`; // plus a slow idle sway
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    // Only animate while the card is on screen.
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerleave', () => { lastX = 0; });
    return () => { io.disconnect(); cancelAnimationFrame(raf); section.removeEventListener('pointermove', onMove); };
  }, []);

  return (
    <div className="hanger" ref={hanger}>
      <div className="strap" aria-hidden="true"><span>{profile.name} · {profile.role} · {profile.name} · {profile.role} ·</span></div>
      <div className="clip" aria-hidden="true" />
      <button type="button" className={`idcard ${flipped ? 'flipped' : ''}`} aria-pressed={flipped}
        aria-label={`Developer ID card for ${profile.name}. Press to flip.`}
        onClick={() => setFlipped(f => !f)} onPointerEnter={e => e.pointerType === 'mouse' && setFlipped(true)}
        onPointerLeave={e => e.pointerType === 'mouse' && setFlipped(false)}>
        <span className="face front">
          <span className="band">Developer ID</span>
          <span className="photo"><img src={photo} alt="" width={800} height={1000} /></span>
          <b>{profile.name}</b>
          <small>{profile.role}</small>
          <span className="rows">
            <span><i>ID No.</i>SL-0001</span>
            <span><i>Dept.</i>CSE · AIML</span>
            <span><i>Valid till</i>2028</span>
          </span>
          <span className="barcode" />
        </span>
        <span className="face back">
          <span className="band">What I am</span>
          <span className="lines">{about.card.map(l => <span key={l}>{l}</span>)}</span>
          <span className="sign">{profile.name.split(' ')[0]}</span>
          <small>If found, say hello · {profile.email}</small>
        </span>
      </button>
    </div>
  );
}

export default function About() {
  return (
    <section className="wrap section" id="about">
      <div className="about">
        <Reveal className="about-text">
          <p className="kicker">02 — About</p>
          <h2>Hi, I'm <em>Sahil.</em></h2>
          {about.paragraphs.map(p => <p key={p}>{p}</p>)}
          <div className="cta-row">
            <a className="btn primary" href={profile.cv} download><Icon name="download" /> Résumé</a>
            <a className="btn" href={profile.github} target="_blank" rel="noopener"><Icon name="github" /> GitHub</a>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noopener"><Icon name="linkedin" /> LinkedIn</a>
          </div>
        </Reveal>
        <IdCard />
        <Reveal className="facts-col" style={{ '--i': 1 } as CSSProperties}>
          <p className="kicker">Quick facts</p>
          <dl className="facts">
            {about.facts.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
          </dl>
          <blockquote>“{about.quote}”</blockquote>
        </Reveal>
      </div>
    </section>
  );
}

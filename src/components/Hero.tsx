import { useEffect, useRef, useState } from 'react';
import { profile, sections } from '../data';
import CommandMenu from './CommandMenu';
import { prefersReducedMotion } from '../hooks';
import Icon from './Icon';
import './Hero.css';

const base = import.meta.env.BASE_URL;

const W = 480, H = 600; // one frame; avatar.mp4 stacks the colour frame above its cut-out mask (2H tall)

/**
 * The talking 3D intro, cut out of its background. Browsers only allow video to autoplay with sound
 * after the visitor has interacted with the page, so it tries sound first, falls back to muted, and
 * turns the voice on at the first click, tap or key press. It pauses when the avatar scrolls out of view.
 */
function IntroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const v = video.current!, out = canvas.current!.getContext('2d')!;
    // Each frame: draw the stacked frame, then copy the mask's brightness into the colour frame's alpha.
    const work = document.createElement('canvas');
    work.width = W; work.height = H * 2;
    const ctx = work.getContext('2d', { willReadFrequently: true })!;
    const draw = () => {
      ctx.drawImage(v, 0, 0);
      const px = ctx.getImageData(0, 0, W, H), mask = ctx.getImageData(0, H, W, H).data;
      for (let i = 3; i < px.data.length; i += 4) px.data[i] = mask[i - 3];
      out.putImageData(px, 0, 0);
      out.canvas.style.backgroundImage = 'none'; // the poster would show through the cut-out otherwise
    };
    let handle = 0;
    const loop = () => { if (v.readyState >= 2) draw(); handle = v.requestVideoFrameCallback ? v.requestVideoFrameCallback(loop) : requestAnimationFrame(loop); };
    loop();

    const play = () => v.play().catch(() => {});
    const firstTouch = () => {
      v.muted = false; v.currentTime = 0; play();
      ['pointerdown', 'keydown', 'touchend'].forEach(t => removeEventListener(t, firstTouch));
    };
    if (!prefersReducedMotion()) {
      v.muted = false;
      v.play().catch(() => {
        v.muted = true; play();
        ['pointerdown', 'keydown', 'touchend'].forEach(t => addEventListener(t, firstTouch));
      });
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.intersectionRatio < 0.35) v.pause();
      else if (!prefersReducedMotion() || !v.muted) play();
    }, { threshold: [0, 0.35, 1] });
    io.observe(v.closest('figure')!);
    return () => {
      io.disconnect();
      v.cancelVideoFrameCallback ? v.cancelVideoFrameCallback(handle) : cancelAnimationFrame(handle);
      ['pointerdown', 'keydown', 'touchend'].forEach(t => removeEventListener(t, firstTouch));
    };
  }, []);

  return (
    <>
      <video ref={video} className="source" loop playsInline preload="auto" muted aria-hidden="true">
        <source src={`${base}hero/avatar.webm`} type="video/webm" />
        <source src={`${base}hero/avatar.mp4`} type="video/mp4" />
      </video>
      <canvas ref={canvas} width={W} height={H} role="img" style={{ backgroundImage: `url(${base}hero/poster.webp)` }}
        aria-label="Animated 3D version of me introducing myself" />
    </>
  );
}

/** Live local time in the banner corner, drawn like a dot-matrix clock: HH:MM:SS */
function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const [h, m, sec] = now.toTimeString().slice(0, 8).split(':');
  const colon = <i className="colon" aria-hidden="true"><b /><b /></i>;
  return <time className="clock" dateTime={now.toISOString()}><span>{h}</span>{colon}<span>{m}</span>{colon}<span>{sec}</span></time>;
}

/** Flips the theme and remembers it. The new theme is revealed by the CSS view transition where supported. */
function ThemeButton() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme !== 'light');
  const flip = () => {
    const next = dark ? 'light' : 'dark';
    const apply = () => { document.documentElement.dataset.theme = next; setDark(!dark); };
    try { localStorage.setItem('theme', next); } catch { /* private mode: the choice just isn't remembered */ }
    if (document.startViewTransition && !prefersReducedMotion()) document.startViewTransition(apply); else apply();
  };
  return (
    <button className="theme-btn" type="button" onClick={flip} aria-label="Toggle theme" aria-pressed={dark}>
      <Icon name={dark ? 'sun' : 'moon'} />
    </button>
  );
}

/** Fixed "Index" list to the right of the column on wide screens; the section in view gets a lit line. */
function IndexNav() {
  const [active, setActive] = useState('');
  useEffect(() => {
    // The header counts too, so scrolling back to the top clears the highlight.
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-40% 0px -55% 0px' });
    ['top', ...sections.map(s => s.id)].forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <nav className="index" aria-label="Sections">
      <h3>Index</h3>
      {sections.map(s => <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'on' : undefined}><span />{s.label}</a>)}
    </nav>
  );
}

const socials = [
  { label: 'GitHub', href: profile.github, icon: 'github' },
  { label: 'LinkedIn', href: profile.linkedin, icon: 'linkedin' },
  { label: 'Email', href: `mailto:${profile.email}`, icon: 'mail' },
] as const;

export default function Hero() {
  return (
    <header className="hero" id="top">
      <IndexNav />
      <div className="banner" aria-hidden="true"><i className="stars" /><i className="hill far" /><i className="hill" /><Clock /></div>
      <div className="profile rule-top rule-bottom">
        <i className="dots" style={{ top: -1 }} /><i className="dots" style={{ bottom: -1 }} />
        <figure className="portrait"><div><IntroVideo /></div></figure>
        <div className="who">
          <h1>{profile.name}</h1>
          <p>{profile.role}</p>
        </div>
        <div className="tools"><CommandMenu /><ThemeButton /></div>
      </div>
      <p className="intro">{profile.intro}</p>
      <ul className="bullets">{profile.bullets.map(b => <li key={b}><span>•</span><span>{b}</span></li>)}</ul>
      <div className="cta-row">
        <a className="chip solid" href={profile.cv} download><Icon name="download" /> Download CV</a>
        <a className="chip" href={`mailto:${profile.email}`}><Icon name="mail" /> Send an email</a>
      </div>
      <h2 className="socials-title">Here are my <b>socials</b></h2>
      <ul className="socials">
        {socials.map(s => (
          <li key={s.label}><a className="chip" href={s.href} target={s.icon === 'mail' ? undefined : '_blank'} rel="noopener"><Icon name={s.icon} /> {s.label}</a></li>
        ))}
      </ul>
    </header>
  );
}

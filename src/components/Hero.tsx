import { useEffect, useRef, useState } from 'react';
import { profile, sections } from '../data';
import { prefersReducedMotion } from '../hooks';
import CommandMenu from './CommandMenu';
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

/** Live local time on the banner, like a watch face: HH.MM.SS */
function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return <time className="clock" dateTime={now.toISOString()}>{now.toTimeString().slice(0, 8).replaceAll(':', '.')}</time>;
}

const socials = [
  { label: 'GitHub', href: profile.github, icon: 'github' },
  { label: 'LinkedIn', href: profile.linkedin, icon: 'linkedin' },
  { label: 'Email', href: `mailto:${profile.email}`, icon: 'mail' },
] as const;

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="banner" aria-hidden="true"><Clock /></div>
      <div className="profile">
        <figure className="portrait"><IntroVideo /></figure>
        <div>
          <h1>{profile.name}.</h1>
          <p className="muted">{profile.tagline}</p>
        </div>
      </div>
      <nav className="index" aria-label="Sections">
        {sections.map(s => <a key={s.id} href={`#${s.id}`}>{s.label}</a>)}
        <CommandMenu />
      </nav>
      <p className="intro">{profile.intro}</p>
      <ul className="bullets">{profile.bullets.map(b => <li key={b}>{b}</li>)}</ul>
      <div className="cta-row">
        <a className="btn primary" href={profile.cv} download><Icon name="download" /> Download CV</a>
        <a className="btn" href={`mailto:${profile.email}`}><Icon name="mail" /> Send an email</a>
      </div>
      <h2 className="socials-title">Here are my socials</h2>
      <ul className="socials">
        {socials.map(s => (
          <li key={s.label}><a href={s.href} target={s.icon === 'mail' ? undefined : '_blank'} rel="noopener"><Icon name={s.icon} /> {s.label}</a></li>
        ))}
      </ul>
    </header>
  );
}

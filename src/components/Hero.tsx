import { useEffect, useRef, useState } from 'react';
import { profile } from '../data';
import { prefersReducedMotion, resetPointer, trackPointer } from '../hooks';
import DecodeText from './DecodeText';
import Icon from './Icon';
import './Hero.css';

const [first, ...rest] = profile.role.split(' ');
const base = import.meta.env.BASE_URL;

/**
 * The talking 3D intro. It loops muted (browsers block autoplay with sound); the round button turns the
 * voice on or off, and the clip pauses whenever the hero is mostly scrolled out of view.
 */
function IntroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = video.current!;
    const io = new IntersectionObserver(([e]) => {
      if (e.intersectionRatio < 0.35) v.pause();
      else if (!prefersReducedMotion() || !v.muted) v.play().catch(() => {});
    }, { threshold: [0, 0.35, 1] });
    io.observe(v.closest('section')!);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = video.current!;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) { v.currentTime = 0; v.play().catch(() => {}); }
  };

  return (
    <>
      <video ref={video} muted loop playsInline preload="auto" poster={`${base}hero/poster.webp`} width={480} height={600}
        aria-label="Animated 3D version of me saying: Hi, I'm Sahil. I'm a full-stack developer.">
        <source src={`${base}hero/hero.mp4`} type="video/mp4" />
      </video>
      <button type="button" className={`sound ${muted ? 'off' : ''}`} onClick={toggle} aria-pressed={!muted}
        aria-label={muted ? 'Play my intro with sound' : 'Mute my intro'}>
        <Icon name={muted ? 'play' : 'pause'} />
      </button>
    </>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-inner">
        <span className="ghost" aria-hidden="true">{profile.name.split(' ')[0]}</span>
        <div className="hero-copy">
          <p className="kicker">{profile.name}</p>
          <h1><DecodeText text={first} /> <em><DecodeText text={rest.join(' ')} /></em></h1>
          <p className="lede">{profile.tagline}</p>
        </div>
        <figure className="portrait" onPointerMove={trackPointer} onPointerLeave={resetPointer}>
          <IntroVideo />
        </figure>
        <div className="hero-side">
          <p>{profile.intro}</p>
          <div className="cta-row">
            <a className="btn primary" href="#projects">Explore work <Icon name="down" /></a>
            <a className="btn" href="#contact">Let's talk</a>
            <a className="btn" href={profile.cv} download><Icon name="download" /> Résumé</a>
          </div>
        </div>
      </div>
    </section>
  );
}

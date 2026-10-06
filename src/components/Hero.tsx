import { useEffect, useRef, useState } from 'react';
import { profile } from '../data';
import { prefersReducedMotion, resetPointer, trackPointer } from '../hooks';
import DecodeText from './DecodeText';
import Icon from './Icon';
import './Hero.css';

const [first, ...rest] = profile.role.split(' ');
const base = import.meta.env.BASE_URL;

const W = 480, H = 600; // one frame; avatar.mp4 stacks the colour frame above its cut-out mask (2H tall)

/**
 * The talking 3D intro, cut out of its background. Browsers only allow video to autoplay with sound
 * after the visitor has interacted with the page, so it tries sound first, falls back to muted, and
 * turns the voice on at the first click, tap or key press. It pauses when the hero scrolls out of view.
 */
function IntroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [muted, setMuted] = useState(true);

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
    const unmute = () => { v.muted = false; setMuted(false); v.currentTime = 0; play(); };
    const firstTouch = (e: Event) => {
      if ((e.target as Element).closest?.('.sound')) return; // the button handles its own click
      unmute();
      ['pointerdown', 'keydown', 'touchend'].forEach(t => removeEventListener(t, firstTouch));
    };
    if (!prefersReducedMotion()) {
      v.muted = false;
      v.play().then(() => setMuted(false), () => {
        v.muted = true; play();
        ['pointerdown', 'keydown', 'touchend'].forEach(t => addEventListener(t, firstTouch));
      });
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.intersectionRatio < 0.35) v.pause();
      else if (!prefersReducedMotion() || !v.muted) play();
    }, { threshold: [0, 0.35, 1] });
    io.observe(v.closest('section')!);
    return () => {
      io.disconnect();
      v.cancelVideoFrameCallback ? v.cancelVideoFrameCallback(handle) : cancelAnimationFrame(handle);
      ['pointerdown', 'keydown', 'touchend'].forEach(t => removeEventListener(t, firstTouch));
    };
  }, []);

  const toggle = () => {
    const v = video.current!;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) { v.currentTime = 0; v.play().catch(() => {}); }
  };

  return (
    <>
      <video ref={video} className="source" loop playsInline preload="auto" muted aria-hidden="true">
        <source src={`${base}hero/avatar.webm`} type="video/webm" />
        <source src={`${base}hero/avatar.mp4`} type="video/mp4" />
      </video>
      <canvas ref={canvas} width={W} height={H} role="img" style={{ backgroundImage: `url(${base}hero/poster.webp)` }}
        aria-label="Animated 3D version of me saying: Hi, I'm Sahil. I'm a full-stack developer." />
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

import { useEffect, useState } from 'react';
import { profile, sections } from '../data';
import NightBanner from './NightBanner';
import CommandMenu from './CommandMenu';
import { prefersReducedMotion } from '../hooks';
import Icon from './Icon';
import './Hero.css';

const base = import.meta.env.BASE_URL;

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
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-20% 0px -60% 0px' });
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

type GitHubUser = { name: string | null; login: string; bio: string | null; location: string | null; public_repos: number; followers: number };
let ghUser: Promise<GitHubUser | null> | null = null; // fetched once per visit

/** Profile card that drops under a social button on hover. GitHub numbers are live from its public API; nothing here is typed in by hand except the LinkedIn handle. */
function SocialCard({ icon }: { icon: string }) {
  const [gh, setGh] = useState<GitHubUser | null>(null);
  const isGh = icon === 'github';
  useEffect(() => {
    if (!isGh) return;
    ghUser ??= fetch(`https://api.github.com/users/${profile.githubUser}`).then(r => (r.ok ? r.json() : null)).catch(() => null);
    ghUser.then(setGh);
  }, [isGh]);
  const name = (isGh && gh?.name) || profile.name;
  const handle = isGh ? (gh?.login ?? profile.githubUser) : `in/${profile.linkedin.split('/in/')[1]}`;
  const bio = (isGh && gh?.bio) || profile.intro;
  return (
    <span className="social-card" aria-hidden="true">
      <span className="sc-top">
        <img src={`${base}hero/pfp.webp`} alt="" />
        <span><b>{name}</b><code>{handle}</code></span>
      </span>
      <span className="sc-bio">{bio}</span>
      {isGh && gh?.location && <span className="sc-loc"><Icon name="pin" />{gh.location}</span>}
      {isGh && gh && <span className="sc-stats"><span><b>{gh.public_repos}</b> Repositories</span><span><b>{gh.followers}</b> Followers</span></span>}
    </span>
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
      <div className="banner" aria-hidden="true">
        <NightBanner />
        <i className="fade" />
        <Clock />
      </div>
      <div className="profile rule-top rule-bottom">
        <i className="dots" style={{ top: -1 }} /><i className="dots" style={{ bottom: -1 }} />
        <figure className="portrait"><div><img src={`${base}hero/pfp.webp`} alt="Profile picture" /></div></figure>
        <div className="who">
          <h1>{profile.name}</h1>
          <p>{profile.role}</p>
        </div>
        <div className="tools"><CommandMenu /><ThemeButton /></div>
      </div>
      <p className="intro">{profile.intro}</p>
      <ul className="bullets">{profile.bullets.map(b => <li key={b}><span>•</span><span>{b.split('**').map((t, i) => i % 2 ? <b key={i}>{t}</b> : t)}</span></li>)}</ul>
      <div className="cta-row">
        <span className="flip">
          {/* Invisible copy sets the size; the real link waits under a lid that hinges open on hover */}
          <span className="chip solid ghost" aria-hidden="true"><Icon name="download" /> Download CV</span>
          <a className="flip-btn" href={profile.cv} download><Icon name="download" /> Download CV</a>
          <span className="cover" aria-hidden="true">
            <span className="innie"><Icon name="download" /> PDF</span>
            <span className="spine" />
            <span className="outie chip solid"><Icon name="download" /> Download CV</span>
          </span>
          <span className="cast" aria-hidden="true" />
        </span>
        <a className="chip" href={`mailto:${profile.email}`}><Icon name="mail" /> Send an email</a>
      </div>
      <h2 className="socials-title">Here are my <b>socials</b></h2>
      <ul className="socials">
        {socials.map(s => (
          <li key={s.label} className="social"><a className="chip" href={s.href} target={s.icon === 'mail' ? undefined : '_blank'} rel="noopener"><Icon name={s.icon} /> {s.label}</a>{s.icon !== 'mail' && <SocialCard icon={s.icon} />}</li>
        ))}
      </ul>
    </header>
  );
}

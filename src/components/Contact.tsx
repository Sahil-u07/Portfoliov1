import { useState, type AnimationEvent, type PointerEvent } from 'react';
import { profile } from '../data';
import Icon from './Icon';
import './Contact.css';

/** Copies the email address; falls back to opening the mail client if the clipboard is unavailable. */
export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email);
    return true;
  } catch {
    location.href = `mailto:${profile.email}`;
    return false;
  }
}

// Each letter hops when the pointer passes over it; the class comes off when the hop ends so it can hop again.
const hop = (e: PointerEvent) => (e.target as HTMLElement).matches('.hop > span > span') && (e.target as HTMLElement).classList.add('hopping');
const land = (e: AnimationEvent) => (e.target as HTMLElement).classList.remove('hopping');
const letters = (line: string) => <span>{[...line].map((c, i) => <span key={i}>{c === ' ' ? ' ' : c}</span>)}</span>;

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (await copyEmail()) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  return (
    <section className="wrap section contact" id="contact">
      <p className="kicker">Contact</p>
      <h2 className="hop" aria-label="Let's build something together." onPointerOver={hop} onAnimationEnd={land}>
        <span aria-hidden="true">{letters("Let's build")}<em>{letters('something together.')}</em></span>
      </h2>
      <p className="contact-lede">I'm looking for internships, and I'm always happy to talk about open source or anything I've built here.</p>
      <div className="email-row">
        <a className="email" href={`mailto:${profile.email}`}>{profile.email}</a>
        <button className="chip-btn" type="button" onClick={copy}>
          <Icon name={copied ? 'check' : 'copy'} /> <span aria-live="polite">{copied ? 'Copied ✓' : 'Copy'}</span>
        </button>
      </div>
      <div className="cta-row">
        <a className="btn" href={profile.cv} download><Icon name="download" /> Résumé</a>
        <a className="btn" href={profile.linkedin} target="_blank" rel="noopener"><Icon name="linkedin" /> LinkedIn</a>
        <a className="btn" href={profile.github} target="_blank" rel="noopener"><Icon name="github" /> GitHub</a>
      </div>
      <svg className="badge" viewBox="0 0 120 120" aria-hidden="true">
        <path id="badge-circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" fill="none" />
        <text><textPath href="#badge-circle">say hello · say hello · say hello · </textPath></text>
        <circle cx="60" cy="60" r="6" />
      </svg>
    </section>
  );
}

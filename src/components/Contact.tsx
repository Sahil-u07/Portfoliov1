import { useState } from 'react';
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

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (await copyEmail()) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  return (
    <section className="wrap section contact" id="contact">
      <div className="contact-card">
        <p className="kicker">Contact</p>
        <h2>Say <em>hi</em></h2>
        <p>I'm looking for internships, and I'm always happy to talk about open source or anything I've built here. Email is the quickest way to reach me.</p>
        <div className="cta-row">
          <button className="btn primary" type="button" onClick={copy}>
            <Icon name={copied ? 'check' : 'copy'} /> <span aria-live="polite">{copied ? 'Copied to clipboard' : profile.email}</span>
          </button>
          <a className="btn" href={profile.cv} download><Icon name="download" /> Download CV</a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noopener"><Icon name="linkedin" /> LinkedIn</a>
          <a className="btn" href={profile.github} target="_blank" rel="noopener"><Icon name="github" /> GitHub</a>
        </div>
      </div>
    </section>
  );
}

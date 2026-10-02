import { profile } from '../data';
import DecodeText from './DecodeText';
import Icon from './Icon';
import './Hero.css';

const [first, last] = profile.name.split(' ');

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <p className="kicker">{profile.tagline}</p>
          <h1><DecodeText text={first} /> <em><DecodeText text={last} /></em></h1>
          <p className="lede">{profile.intro}</p>
          <div className="cta-row">
            <a className="btn primary" href="#projects">See my projects <Icon name="down" /></a>
            <a className="btn" href={profile.github} target="_blank" rel="noopener"><Icon name="github" /> GitHub</a>
            <a className="btn" href={`mailto:${profile.email}`}><Icon name="mail" /> Email</a>
          </div>
        </div>
      </div>
    </section>
  );
}

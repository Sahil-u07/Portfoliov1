import { profile } from '../data';
import DecodeText from './DecodeText';
import Icon from './Icon';
import RetrievalField from './RetrievalField';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <p className="kicker">{profile.tagline}</p>
          <h1><DecodeText text={profile.name} /></h1>
          <p className="lede">{profile.intro}</p>
          <div className="cta-row">
            <a className="btn primary" href="#projects">See my projects <Icon name="down" /></a>
            <a className="btn" href={profile.github} target="_blank" rel="noopener"><Icon name="github" /> GitHub</a>
            <a className="btn" href={`mailto:${profile.email}`}><Icon name="mail" /> Email</a>
          </div>
        </div>
        <RetrievalField />
      </div>
    </section>
  );
}

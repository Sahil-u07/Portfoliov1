import photo from '../assets/sahil.webp';
import { profile } from '../data';
import { resetPointer, trackPointer } from '../hooks';
import DecodeText from './DecodeText';
import Icon from './Icon';
import './Hero.css';

const [first, ...rest] = profile.role.split(' ');

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
          <img src={photo} width={800} height={1000} alt="Sahil Lenka" fetchPriority="high" />
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

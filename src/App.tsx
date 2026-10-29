import { profile } from './data';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import GithubActivity from './components/GithubActivity';
import OpenSource from './components/OpenSource';
import Skills from './components/Skills';
import Highlights from './components/Highlights';
import './components/Sections.css';

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="site"><div className="page">
        <Hero />
        <main id="main">
          <Experience />
          <Projects />
          <GithubActivity />
          <OpenSource />
          <Skills />
          <Highlights />
          <figure className="quote rule-top">
            <i className="dots" style={{ top: -1 }} />
            <blockquote>"{profile.quote}"</blockquote>
            <figcaption><i />{profile.quoteBy}<i /></figcaption>
          </figure>
        </main>
        <div className="floor rule-top" aria-hidden="true" onMouseMove={e => {
          const r = e.currentTarget.getBoundingClientRect(), z = e.currentTarget.offsetWidth / r.width;
          e.currentTarget.style.setProperty('--x', `${(e.clientX - r.left) * z}px`);
          e.currentTarget.style.setProperty('--y', `${(e.clientY - r.top) * z}px`);
        }}><i className="dots" style={{ top: -1 }} /></div>
      </div></div>
    </>
  );
}

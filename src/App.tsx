import { profile, quotes } from './data';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import GithubActivity from './components/GithubActivity';
import OpenSource from './components/OpenSource';
import Skills from './components/Skills';
import Highlights from './components/Highlights';
import Section from './components/Section';
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
          <Section id="quotes" title="Words I live by">
            <ul className="quotes">
              {quotes.map(q => <li key={q}><blockquote>{q}</blockquote><span>Alex Hormozi</span></li>)}
            </ul>
          </Section>
          <figure className="quote">
            <blockquote>"{profile.quote}"</blockquote>
            <figcaption><i />{profile.name}<i /></figcaption>
          </figure>
        </main>
        <div className="floor rule-top" aria-hidden="true"><i className="dots" style={{ top: -1 }} /></div>
      </div></div>
    </>
  );
}

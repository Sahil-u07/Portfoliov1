import { profile } from './data';
import Nav from './components/Nav';
import CommandMenu from './components/CommandMenu';
import Hero from './components/Hero';
import About from './components/About';
import Achievements from './components/Achievements';
import Projects from './components/Projects';
import EvidenceRag from './components/EvidenceRag';
import OpenSource from './components/OpenSource';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Contact from './components/Contact';

export default function App() {
  return (
    <>
      <div className="progress" aria-hidden="true" />
      <a className="skip" href="#main">Skip to content</a>
      <Nav><CommandMenu /></Nav>
      <main id="main">
        <Hero />
        <About />
        <div className="zoom" aria-hidden="true"><div className="zoom-stage"><div className="zoom-tile">SL</div></div></div>
        <Experience />
        <Projects />
        <EvidenceRag />
        <OpenSource />
        <Skills />
        <Achievements />
        <Contact />
      </main>
      <footer className="wrap footer">
        <span>{profile.name}</span>
        <span>Made with React and Vite.</span>
      </footer>
    </>
  );
}

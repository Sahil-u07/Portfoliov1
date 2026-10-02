import { profile } from './data';
import Nav from './components/Nav';
import CommandMenu from './components/CommandMenu';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Projects from './components/Projects';
import EvidenceRag from './components/EvidenceRag';
import OpenSource from './components/OpenSource';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Ribbons from './components/Ribbons';

export default function App() {
  return (
    <>
      <Ribbons />
      <div className="progress" aria-hidden="true" />
      <a className="skip" href="#main">Skip to content</a>
      <Nav><CommandMenu /></Nav>
      <main id="main">
        <Hero />
        <Stats />
        <Projects />
        <EvidenceRag />
        <OpenSource />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <footer className="wrap footer">
        <span>{profile.name}</span>
        <span>Built with React and Vite. No UI or animation libraries.</span>
      </footer>
    </>
  );
}

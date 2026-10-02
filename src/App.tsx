import { profile } from './data';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Stats from './components/Stats';
import EvidenceRag from './components/EvidenceRag';
import OpenSource from './components/OpenSource';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Contact from './components/Contact';

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Stats />
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

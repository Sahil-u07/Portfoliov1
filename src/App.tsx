import Nav from './components/Nav';
import Hero from './components/Hero';
import Stats from './components/Stats';
import EvidenceRag from './components/EvidenceRag';
import OpenSource from './components/OpenSource';

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
      </main>
    </>
  );
}

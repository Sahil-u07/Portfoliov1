import Nav from './components/Nav';
import Hero from './components/Hero';
import Stats from './components/Stats';

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Stats />
      </main>
    </>
  );
}

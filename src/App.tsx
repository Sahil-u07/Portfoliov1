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
      <div className="page">
        <Hero />
        <main id="main">
          <Experience />
          <Projects />
          <GithubActivity />
          <OpenSource />
          <Skills />
          <Highlights />
          <figure className="quote">
            <blockquote>“{profile.quote}”</blockquote>
            <figcaption>{profile.name}</figcaption>
          </figure>
        </main>
        <footer className="footer muted">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import { blogs, profile } from './data';
import Post from './components/Post';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import GithubActivity from './components/GithubActivity';
import OpenSource from './components/OpenSource';
import Skills from './components/Skills';
import Blog from './components/Blog';
import Highlights from './components/Highlights';
import './components/Sections.css';

const postFor = () => blogs.find(b => location.hash === `#blog/${b.slug}`);

export default function App() {
  const [post, setPost] = useState(postFor);
  useEffect(() => {
    const onHash = () => setPost(postFor());
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);
  // Changing page: start a post at the top; coming back, land on the section the link points at.
  useEffect(() => {
    if (post) scrollTo(0, 0); else document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, [post]);

  if (post) return <div className="site"><div className="page"><Post post={post} /></div></div>;
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
          <Blog />
          <Highlights />
          <figure className="quote rule-top">
            <i className="dots" style={{ top: -1 }} />
            <blockquote>"{profile.quote.split('\n').map((l, i) => <span key={i}>{i > 0 && <br />}{l}{i === 0 && ' '}</span>)}"</blockquote>
            <figcaption><i />{profile.quoteBy}<i /></figcaption>
          </figure>
        </main>
        <div className="floor rule-top" aria-hidden="true" onMouseMove={e => {
          const r = e.currentTarget.getBoundingClientRect(), z = e.currentTarget.offsetWidth / r.width;
          e.currentTarget.style.setProperty('--x', `${(e.clientX - r.left) * z}px`);
          e.currentTarget.style.setProperty('--y', `${(e.clientY - r.top) * z}px`);
        }}><i className="dots" style={{ top: -1 }} /><b /></div>
      </div></div>
    </>
  );
}

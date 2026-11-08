import { blogs } from '../data';
import NightBanner from './NightBanner';
import CommandMenu from './CommandMenu';
import Icon from './Icon';
import { Clock, ThemeButton } from './Hero';
import './Hero.css';

/** One blog post as its own page, opened from the Blogs list at #blog/<slug>. */
export default function Post({ post }: { post: (typeof blogs)[number] }) {
  const words = post.body?.join(' ').split(/\s+/).length ?? 0;
  return (
    <>
      <header className="hero">
        <div className="banner" aria-hidden="true"><NightBanner /><i className="fade" /><Clock /></div>
        <div className="profile post-top rule-top rule-bottom">
          <i className="dots" style={{ top: -1 }} /><i className="dots" style={{ bottom: -1 }} />
          <a className="back" href="#blog" aria-label="Back"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg></a>
          <div className="who"><p className="post-kind">Blog</p><p className="post-path">Blogs/{post.slug}</p></div>
          <div className="tools"><CommandMenu /><ThemeButton /></div>
        </div>
      </header>
      <main id="main" className="post">
        <ul className="tags">{post.tags.map(t => <li key={t}>{t}</li>)}</ul>
        <h1>{post.title}</h1>
        <p className="post-sub">{post.subtitle}</p>
        <p className="post-meta">
          <span><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>{post.date}</span>
          {words > 0 && <span>{Math.ceil(words / 200)} min read</span>}
        </p>
        {post.cover && <img className="post-cover" src={post.cover} alt="" onError={e => e.currentTarget.remove()} />}
        {post.body?.map((p, i) => <p key={i} className="post-body">{p}</p>)}
        <a className="chip read-on" href={post.url} target="_blank" rel="noopener">{post.body ? 'View on Medium' : 'Read the full post on Medium'} <Icon name="arrow" /></a>
      </main>
    </>
  );
}

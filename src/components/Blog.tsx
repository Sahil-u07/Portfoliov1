import { blogs, profile } from '../data';
import Section, { ViewAll } from './Section';

export default function Blog() {
  return (
    <Section id="blog" title="Blogs">
      <ul className="posts">
        {blogs.map(b => (
          <li key={b.url} className="rule-bottom">
            <a href={b.url} target="_blank" rel="noopener">
              <h3>{b.title}</h3>
              <span className="post-meta">
                <span><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>{b.date}</span>
                <ul className="tags">{b.tags.map(t => <li key={t}>{t}</li>)}</ul>
              </span>
              <svg className="ic go" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
          </li>
        ))}
      </ul>
      <ViewAll href={profile.medium} />
    </Section>
  );
}

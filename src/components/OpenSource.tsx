import { useEffect, useState } from 'react';
import { openSource, profile } from '../data';
import Section, { ViewAll } from './Section';

type Tab = 'merged' | 'open' | 'closed';
type Pr = { title: string; url: string; repo: string };
const TABS: Tab[] = ['merged', 'open', 'closed'];
const filters: Record<Tab, string> = { merged: 'is:merged', open: 'is:open', closed: 'is:closed is:unmerged' };
// Pull requests to other people's projects, newest first, from GitHub's public search API.
export const searchUrl = (tab: Tab) =>
  `https://api.github.com/search/issues?q=${encodeURIComponent(`author:${profile.githubUser} type:pr -user:${profile.githubUser} ${filters[tab]}`)}&sort=updated&per_page=4`;
const searchPage = (tab: Tab) => `https://github.com/pulls?q=${encodeURIComponent(`author:${profile.githubUser} is:pr -user:${profile.githubUser} ${filters[tab]}`)}`;

export default function OpenSource() {
  const [tab, setTab] = useState<Tab>('merged');
  const [lists, setLists] = useState<Partial<Record<Tab, { total: number; items: Pr[] } | 'failed'>>>({});
  const list = lists[tab];

  useEffect(() => {
    if (lists[tab]) return;
    fetch(searchUrl(tab))
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((d: { total_count: number; items: { title: string; html_url: string; repository_url: string }[] }) =>
        setLists(l => ({ ...l, [tab]: { total: d.total_count, items: d.items.map(i => ({ title: i.title, url: i.html_url, repo: i.repository_url.split('/repos/')[1] })) } })))
      .catch(() => setLists(l => ({ ...l, [tab]: 'failed' })));
  }, [tab, lists]);

  const tabs = (
    <div className="tabs ring" role="tablist" aria-label="Pull request state">
      <div className="tabs-inner">
        <span className="tab-pill" style={{ translate: `${TABS.indexOf(tab) * 100}% 0` }} aria-hidden="true" />
        {TABS.map(t => <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{t}</button>)}
      </div>
    </div>
  );

  return (
    <Section id="open-source" title="Open Source Contributions" aside={tabs}>
      {/* The per-project counts are my own tally; the list below is live from GitHub */}
      <dl className="stats os-stats">
        {openSource.map(p => <div key={p.name}><dd><a className="more" href={p.url} target="_blank" rel="noopener">{p.count ? `${p.count}+` : 'Counting'}</a></dd><dt>{p.name}</dt></div>)}
      </dl>
      <ul className="prs" role="tabpanel">
        {list === 'failed' ? openSource.map(p => (
          <li key={p.name} className="rule-bottom"><a href={p.url} target="_blank" rel="noopener"><span className="pr-title"><i className="merged" /><h3>{p.name}</h3></span><span className="pr-repo">{p.body}</span></a></li>
        )) : !list ? (
          <li className="muted pr-wait">Loading pull requests…</li>
        ) : list.items.length === 0 ? (
          <li className="muted pr-wait">Nothing {tab} right now.</li>
        ) : list.items.map(pr => (
          <li key={pr.url} className="rule-bottom"><a href={pr.url} target="_blank" rel="noopener"><span className="pr-title"><i className={tab} /><h3>{pr.title}</h3></span><span className="pr-repo">{pr.repo}</span></a></li>
        ))}
      </ul>
      <ViewAll href={searchPage(tab)} label={list && list !== 'failed' && list.total > list.items.length ? `View All (${list.total - list.items.length} more)` : 'View All'} />
    </Section>
  );
}

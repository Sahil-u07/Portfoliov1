import type { ReactNode } from 'react';

/** A section: dashed rules above and below its heading, with dots where they meet the column edges. */
export default function Section({ id, title, aside, children }: { id: string; title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="section rule-top" id={id} aria-labelledby={`${id}-title`}>
      <i className="dots" style={{ top: -1 }} />
      <div className="sec-head rule-bottom">
        <h2 id={`${id}-title`}>{title}</h2>
        {aside}
        <i className="dots" style={{ bottom: -1 }} />
      </div>
      {children}
    </section>
  );
}

export const ViewAll = ({ href, label = 'View All' }: { href: string; label?: string }) => (
  <div className="view-all">
    <a className="ring" href={href} target="_blank" rel="noopener"><span className="soft">{label} <svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7" /></svg></span></a>
  </div>
);

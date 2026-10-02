import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { evidenceRag, profile, sections } from '../data';
import { copyEmail } from './Contact';
import Icon from './Icon';
import './CommandMenu.css';

type Command = { label: string; hint: string; run: () => void };

const go = (id: string) => () => { location.hash = id; };
const open = (url: string) => () => window.open(url, '_blank', 'noopener');

const COMMANDS: Command[] = [
  ...sections.map(s => ({ label: s.label, hint: `Jump to ${s.label.toLowerCase()}`, run: go(s.id) })),
  { label: 'How EvidenceRAG works', hint: 'Pipeline demo and benchmark', run: go('evidencerag') },
  { label: 'Back to top', hint: 'Home', run: go('top') },
  { label: 'Copy email address', hint: profile.email, run: () => void copyEmail() },
  { label: 'GitHub profile', hint: 'github.com/Sahil-u07', run: open(profile.github) },
  { label: 'LinkedIn profile', hint: 'linkedin.com/in/sahil-lenka-3608a2311', run: open(profile.linkedin) },
  { label: 'EvidenceRAG source', hint: 'github.com/Sahil-u07/evidencerag', run: open(evidenceRag.repo) },
];

/** Ctrl/Cmd+K (or "/") command menu. Native <dialog> gives focus trapping, Esc and the backdrop for free. */
export default function CommandMenu() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const q = query.trim().toLowerCase();
  const shown = COMMANDS.filter(c => `${c.label} ${c.hint}`.toLowerCase().includes(q));

  const show = () => { setQuery(''); setSel(0); dialog.current!.showModal(); };
  const run = (c?: Command) => { if (!c) return; dialog.current!.close(); c.run(); };

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const typing = (e.target as HTMLElement).closest('input, textarea');
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) {
        e.preventDefault();
        dialog.current!.open ? dialog.current!.close() : show();
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  const onInputKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (shown.length) setSel(s => (s + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(shown[sel]);
    }
  };

  return (
    <>
      <button className="menu-btn" type="button" onClick={show} aria-label="Open command menu">
        <Icon name="search" />
        <span className="wide">Jump to</span><kbd className="wide">Ctrl K</kbd><span className="narrow">Menu</span>
      </button>
      <dialog ref={dialog} className="palette" aria-label="Command menu"
        onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
        <input autoFocus value={query} placeholder="Type a section or action…" aria-label="Search commands" autoComplete="off"
          role="combobox" aria-expanded="true" aria-controls="palette-list"
          aria-activedescendant={shown[sel] ? `cmd-${sel}` : undefined}
          onChange={e => { setQuery(e.target.value); setSel(0); }} onKeyDown={onInputKey} />
        <ul id="palette-list" role="listbox" aria-label="Commands">
          {shown.length === 0 && <li className="empty">No matches</li>}
          {shown.map((c, i) => (
            <li key={c.label} id={`cmd-${i}`} role="option" aria-selected={i === sel}
              onClick={() => run(c)} onPointerMove={() => setSel(i)}>
              <b>{c.label}</b><span>{c.hint}</span>
            </li>
          ))}
        </ul>
        <p className="palette-hint"><kbd>↑</kbd><kbd>↓</kbd> move · <kbd>Enter</kbd> select · <kbd>Esc</kbd> close</p>
      </dialog>
    </>
  );
}

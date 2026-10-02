import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../hooks';

/** Scrambles text into its own shuffled letters that resolve left to right, on load and on hover. */
export default function DecodeText({ text }: { text: string }) {
  const [shown, setShown] = useState(text);
  const timer = useRef(0);

  const decode = useCallback(() => {
    if (prefersReducedMotion()) return;
    clearInterval(timer.current);
    // Scramble with the text's own letters so widths stay close and the line doesn't jump or wrap.
    const glyphs = text.replace(/\s/g, '');
    let frame = 0;
    timer.current = window.setInterval(() => {
      frame++;
      setShown([...text].map((ch, i) =>
        ch === ' ' || frame > i * 2 ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]).join(''));
      if (frame > text.length * 2) clearInterval(timer.current);
    }, 35);
  }, [text]);

  useEffect(() => { decode(); return () => clearInterval(timer.current); }, [decode]);

  // Screen readers get the real text; the scrambling span is hidden from them.
  return <span aria-label={text} onPointerEnter={decode}><span aria-hidden="true">{shown}</span></span>;
}

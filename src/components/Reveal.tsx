import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { useReveal } from '../hooks';

type Props<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

/** Fades its content in the first time it scrolls into view. */
export default function Reveal<T extends ElementType = 'div'>({ as, className = '', ...rest }: Props<T>) {
  const [ref, shown] = useReveal<HTMLElement>();
  const Tag: ElementType = as ?? 'div';
  return <Tag ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} {...rest} />;
}

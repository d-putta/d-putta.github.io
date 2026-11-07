import { useRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';
import { cx } from '@/lib/cx';

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Stagger delay in milliseconds. */
  delay?: number;
  children: ReactNode;
}

/**
 * Fades and lifts its children into view on first scroll into the viewport.
 * Content is visible by default; the hidden state is applied only once the
 * component has mounted, so nothing depends on JavaScript to be readable.
 */
export function Reveal({ as, delay = 0, className, style, children, ...rest }: RevealProps) {
  const Tag: ElementType = as ?? 'div';
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);

  return (
    <Tag
      ref={ref}
      className={cx('reveal', inView ? 'is-in' : 'is-hidden', className)}
      style={delay ? { ...style, transitionDelay: `${String(delay)}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

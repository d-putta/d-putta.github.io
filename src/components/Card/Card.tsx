import {
  useRef,
  type ElementType,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cx } from '@/lib/cx';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Tilt toward the pointer on wide screens. */
  tilt?: boolean;
  children: ReactNode;
}

/** Glass card with a pointer-following glow and optional 3D tilt. */
export function Card({ as, tilt = false, className, children, ...rest }: CardProps) {
  const Tag: ElementType = as ?? 'div';
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    element.style.setProperty('--gx', `${String(x * 100)}%`);
    element.style.setProperty('--gy', `${String(y * 100)}%`);
    if (tilt && !reduced && rect.width > 320) {
      element.style.transform = `perspective(900px) rotateX(${String((0.5 - y) * 4)}deg) rotateY(${String((x - 0.5) * 5)}deg) translateY(-2px)`;
    }
  };

  const onPointerLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <Tag
      ref={ref}
      className={cx(styles.card, className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}

import { profile } from '@/content/profile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cx } from '@/lib/cx';
import styles from './Ticker.module.css';

/**
 * Horizontal marquee of focus keywords. The list is rendered twice so the
 * track's translateX(-50%) loop is seamless; it pauses on hover and sits still
 * when the visitor prefers reduced motion. The band is aria-hidden because
 * every item also appears elsewhere on the page (Skills, Hero, Credentials).
 */
export function Ticker() {
  const reduced = useReducedMotion();
  const items = [...profile.ticker, ...profile.ticker];

  return (
    <div className={cx(styles.ticker, reduced && styles.static)} aria-hidden="true">
      <div className={cx(styles.track)}>
        {items.map((item, i) => (
          <span className={cx(styles.item)} key={`${item}-${String(i)}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

import type { ProjectVisual } from '@/content/types';
import { cx } from '@/lib/cx';
import styles from './Work.module.css';

type ArchVisualData = Extract<ProjectVisual, { kind: 'arch' }>;

/**
 * Simplified architecture as a three-column node grid: a full-width edge row,
 * three highlighted core nodes with subtitles, three stores and a full-width
 * base row.
 */
export function ArchVisual({ visual }: { visual: ArchVisualData }) {
  return (
    <ul className={styles.arch} role="list">
      <li className={cx(styles.archNode, styles.wide)}>{visual.edge}</li>
      {visual.core.map((node) => (
        <li key={node.title} className={cx(styles.archNode, styles.core)}>
          {node.title}
          <span className={styles.archSub}>{node.sub}</span>
        </li>
      ))}
      {visual.stores.map((store) => (
        <li key={store} className={styles.archNode}>
          {store}
        </li>
      ))}
      <li className={cx(styles.archNode, styles.wide)}>{visual.base}</li>
    </ul>
  );
}

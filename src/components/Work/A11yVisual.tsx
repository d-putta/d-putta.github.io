import type { ProjectVisual } from '@/content/types';
import { chrome } from './chrome';
import styles from './Work.module.css';

type A11yVisualData = Extract<ProjectVisual, { kind: 'a11y' }>;

/**
 * Scan summary panel: one row per repository with its status, a coverage row
 * and a bar that fills to 100% once the card has scrolled into view (driven by
 * the Reveal wrapper's `is-in` class, so it needs no script of its own).
 */
export function A11yVisual({ visual }: { visual: A11yVisualData }) {
  return (
    <div className={styles.viz}>
      <ul className={styles.vizRows} role="list">
        {visual.repos.map((repo) => (
          <li key={repo} className={styles.vizRow}>
            <span>{repo}</span>
            <span className={styles.ok}>{chrome.a11y.status}</span>
          </li>
        ))}
      </ul>
      <div className={styles.vizCoverage}>
        <span>{chrome.a11y.coverage}</span>
        <span className={styles.ok}>{visual.coverageLabel}</span>
      </div>
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.barFill} />
      </div>
    </div>
  );
}

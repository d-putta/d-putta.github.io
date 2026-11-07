import { Card } from '@/components/Card/Card';
import { Reveal } from '@/components/Reveal/Reveal';
import { profile } from '@/content/profile';
import type { FocusIcon } from '@/content/types';
import { cx } from '@/lib/cx';
import styles from './Focus.module.css';

/** Decorative line icon for a focus area; stroke and size come from the module CSS. */
function Glyph({ icon }: { icon: FocusIcon }) {
  switch (icon) {
    case 'agents':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        </svg>
      );
    case 'architecture':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <rect x="3" y="4" width="7" height="6" rx="1.5" />
          <rect x="14" y="4" width="7" height="6" rx="1.5" />
          <rect x="8.5" y="14" width="7" height="6" rx="1.5" />
          <path d="M6.5 10v2a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2" />
        </svg>
      );
    case 'cloud':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M7 18a4 4 0 0 1-.6-7.95A6 6 0 0 1 18 9.5a4.5 4.5 0 0 1-.5 8.5H7z" />
          <path d="M12 12v6M9.5 15.5 12 18l2.5-2.5" />
        </svg>
      );
  }
}

/**
 * Inner content of the Focus section: a grid of tilting glass cards, one per
 * focus area, each revealed on scroll with a 90ms stagger.
 */
export function Focus() {
  return (
    <div className={styles.grid}>
      {profile.focus.areas.map((area, i) => (
        <Reveal key={area.title} className={cx(styles.item)} delay={i * 90}>
          <Card tilt className={cx(styles.card)}>
            <div className={styles.icon}>
              <Glyph icon={area.icon} />
            </div>
            <h3 className={styles.title}>{area.title}</h3>
            <p className={styles.description}>{area.description}</p>
            <div className={styles.tags}>
              {area.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

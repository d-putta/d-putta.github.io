import { Card } from '@/components/Card/Card';
import { Reveal } from '@/components/Reveal/Reveal';
import { profile } from '@/content/profile';
import { cx } from '@/lib/cx';
import styles from './Certifications.module.css';

/** Delay between neighbouring cards as they reveal, in milliseconds (matches the prototype). */
const STAGGER_MS = 90;

/**
 * Inner content of the Credentials section: a two-column grid of certification
 * cards (one column at narrow widths). `App` wraps it in `<Section>`, which
 * supplies the "// CREDENTIALS" rail heading.
 */
export function Certifications() {
  return (
    <div className={styles.certs}>
      {profile.credentials.items.map((item, i) => {
        const [badgeTop, badgeBottom] = item.badge;
        return (
          <Reveal key={item.code} className={styles.item} delay={i * STAGGER_MS}>
            <Card tilt className={cx(styles.cert, item.highlight && styles.pro)}>
              {/* The badge repeats the code shown below, so assistive tech skips it. */}
              <div className={styles.badge} aria-hidden="true">
                {badgeTop}
                <br />
                {badgeBottom}
              </div>
              <div>
                <h3 className={styles.title}>{item.title}</h3>
                <div className={styles.code}>
                  <span>{item.code}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </Card>
          </Reveal>
        );
      })}
    </div>
  );
}

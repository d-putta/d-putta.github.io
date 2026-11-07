import type { CSSProperties } from 'react';
import { Card } from '@/components/Card/Card';
import { Reveal } from '@/components/Reveal/Reveal';
import { profile } from '@/content/profile';
import styles from './Skills.module.css';

/**
 * Delay between neighbouring cards as they reveal, in milliseconds. Also handed to the
 * module CSS as `--d`, so the chip pop-in waits for the card's own reveal delay.
 */
const STAGGER_MS = 90;

/** Per-chip stagger index, read by the module CSS as `--i`. */
interface ChipStyle extends CSSProperties {
  '--i': number;
}

/** Card reveal delay, read by the module CSS as `--d`. */
interface ItemStyle extends CSSProperties {
  '--d': string;
}

/**
 * Inner content of the Capabilities section (App wraps it in `<Section>`): one glass
 * card per skill group with a wrapped list of chips. Cards reveal on scroll with a 90ms
 * stagger; the chips pop in with a 35ms stagger once their card starts to reveal (the
 * card's delay is passed down as `--d`, so the pop never runs under a still-transparent
 * card). The motion is pure CSS, so there is nothing to clean up and reduced-motion
 * visitors see every chip at once.
 */
export function Skills() {
  return (
    <div className={styles.grid}>
      {profile.skills.groups.map((group, i) => {
        const delay = i * STAGGER_MS;
        const itemStyle: ItemStyle = { '--d': `${String(delay)}ms` };
        return (
          <Reveal key={group.title} delay={delay} className={styles.item} style={itemStyle}>
            <Card className={styles.card}>
              <h3 className={styles.title}>{group.title}</h3>
              <ul className={styles.list} role="list">
                {group.items.map((item, j) => {
                  const style: ChipStyle = { '--i': j };
                  return (
                    <li
                      key={`${item}-${String(j)}`}
                      className={styles.chip}
                      style={style}
                      data-chip=""
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </Card>
          </Reveal>
        );
      })}
    </div>
  );
}

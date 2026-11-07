import type { CSSProperties, ReactNode } from 'react';
import { Reveal } from '@/components/Reveal/Reveal';
import { cx } from '@/lib/cx';
import styles from './Section.module.css';

interface SectionProps {
  id: string;
  /** Small mono label above the heading, e.g. "FOCUS". */
  index: string;
  title: string;
  blurb: string;
  children: ReactNode;
}

/** A page section with the sticky rail heading on the left and content on the right. */
export function Section({ id, index, title, blurb, children }: SectionProps) {
  const words = title.split(/\s+/);
  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-title`}>
      <div className={cx('wrap', styles.grid)}>
        <Reveal as="aside" className={styles.rail}>
          <div className={styles.index}>{`// ${index}`}</div>
          <h2 className={styles.title} id={`${id}-title`}>
            {words.map((word, i) => (
              <span key={`${word}-${String(i)}`}>
                <span className={styles.word} style={{ '--i': i } as CSSProperties}>
                  {word}
                </span>
                {i < words.length - 1 ? ' ' : null}
              </span>
            ))}
          </h2>
          <p className={styles.blurb}>{blurb}</p>
        </Reveal>
        <div>{children}</div>
      </div>
    </section>
  );
}

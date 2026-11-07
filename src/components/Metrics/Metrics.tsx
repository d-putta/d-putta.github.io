import { useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/Reveal/Reveal';
import { profile } from '@/content/profile';
import type { Metric } from '@/content/types';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cx } from '@/lib/cx';
import styles from './Metrics.module.css';

/** Landmark name of the strip; a structural label, not résumé copy. */
const STRIP_LABEL = 'Key figures';
/** Length of the count-up in milliseconds. */
const COUNT_DURATION = 1200;
/** Reveal stagger between neighbouring cells in milliseconds. */
const STAGGER = 90;

/** Fast start, gentle landing. */
function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3;
}

/**
 * Counts from 0 to `target` once `active` is true, starting `delay` milliseconds
 * later so the count lines up with a staggered reveal. Returns the value to show;
 * when motion is reduced that is the final value straight away.
 */
function useCountUp(
  target: number | undefined,
  active: boolean,
  reduced: boolean,
  delay = 0,
): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === undefined || reduced || !active) return;
    if (typeof window.requestAnimationFrame !== 'function') {
      setCount(target);
      return;
    }

    let frame = 0;
    let start: number | null = null;
    const step = (timestamp: number) => {
      start ??= timestamp + delay;
      const progress = Math.min(1, Math.max(0, (timestamp - start) / COUNT_DURATION));
      setCount(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [target, active, reduced, delay]);

  if (target === undefined) return 0;
  return reduced ? target : count;
}

interface MetricCellProps {
  metric: Metric;
  index: number;
  reduced: boolean;
}

/** One figure: the value (counted up when numeric), its unit and a label. */
function MetricCell({ metric, index, reduced }: MetricCellProps) {
  const valueRef = useRef<HTMLDivElement>(null);
  const inView = useInView(valueRef);
  const count = useCountUp(metric.countTo, inView, reduced, index * STAGGER);
  const isNumeric = metric.countTo !== undefined;
  const finished = metric.countTo === undefined || reduced || count >= metric.countTo;
  const shown = inView && !finished ? String(count) : metric.value;

  return (
    <Reveal className={cx(styles.cell, inView && styles.in)} delay={index * STAGGER}>
      <div ref={valueRef} className={cx(styles.val, isNumeric && 'num')}>
        <span>{shown}</span>
        {metric.unit ? <small className={styles.unit}>{metric.unit}</small> : null}
      </div>
      <div className={styles.lab}>{metric.label}</div>
    </Reveal>
  );
}

/** The key-figures strip under the ticker: five staggered cells from `profile.metrics`. */
export function Metrics() {
  const reduced = useReducedMotion();

  return (
    <section className={styles.strip} aria-label={STRIP_LABEL}>
      <div className={cx('wrap', styles.grid)}>
        {profile.metrics.map((metric, index) => (
          <MetricCell key={metric.label} metric={metric} index={index} reduced={reduced} />
        ))}
      </div>
    </section>
  );
}

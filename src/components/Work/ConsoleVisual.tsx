import { useEffect, useId, useRef, useState } from 'react';
import type { ProjectVisual } from '@/content/types';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cx } from '@/lib/cx';
import { chrome } from './chrome';
import styles from './Work.module.css';

type ConsoleVisualData = Extract<ProjectVisual, { kind: 'console' }>;

/** The trace replays this often while the console is on screen. */
const REPLAY_EVERY_MS = 9000;
/** Delay before the first trace line returns during a replay... */
const FIRST_LINE_MS = 300;
/** ...and the gap between each following line. */
const STAGGER_MS = 380;

/**
 * Glass terminal: a title bar with three lights, the command with a blinking
 * caret, and the trace lines. While the console is on screen and motion is
 * allowed, the trace blanks out every 9s and the lines return one by one. With
 * reduced motion (or off screen) every line simply stays visible.
 */
export function ConsoleVisual({ visual }: { visual: ConsoleVisualData }) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const reduced = useReducedMotion();
  const onScreen = useInView(ref, { threshold: 0, once: false });
  const total = visual.lines.length;
  /** Number of trace lines currently visible; lines at or past it are pending. */
  const [shown, setShown] = useState(total);

  useEffect(() => {
    if (reduced || !onScreen || total === 0) return;
    let timers: number[] = [];
    const replay = () => {
      for (const timer of timers) window.clearTimeout(timer);
      setShown(0);
      timers = visual.lines.map((_line, i) =>
        window.setTimeout(() => {
          setShown(i + 1);
        }, FIRST_LINE_MS + i * STAGGER_MS),
      );
    };
    const interval = window.setInterval(replay, REPLAY_EVERY_MS);
    return () => {
      window.clearInterval(interval);
      for (const timer of timers) window.clearTimeout(timer);
      setShown(total);
    };
  }, [reduced, onScreen, total, visual.lines]);

  return (
    <div ref={ref} className={styles.console} role="group" aria-labelledby={titleId}>
      <div className={styles.consoleBar}>
        <div className={styles.lights} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className={styles.consoleTitle} id={titleId}>
          {visual.title}
        </div>
        <div className={cx('mono', styles.live)}>{chrome.console.live}</div>
      </div>
      <div className={styles.consoleBody}>
        <div className={cx(styles.line, styles.cmd)}>
          <span className={cx(styles.glyph, styles.step)} aria-hidden="true">
            $
          </span>
          <span className={styles.value}>
            {visual.command}
            <span className="caret" aria-hidden="true" />
          </span>
        </div>
        {visual.lines.map((line, i) => (
          <div
            key={`${line.tool}-${String(i)}`}
            className={cx(styles.line, i >= shown && styles.pending)}
          >
            <span
              className={cx(styles.glyph, line.status === 'ok' ? styles.ok : styles.step)}
              aria-hidden="true"
            >
              {line.status === 'ok' ? '✓' : '▸'}
            </span>
            <span className={styles.tool}>{line.tool}</span>
            <span className={styles.value}>
              {line.value}
              {line.dim ? (
                <>
                  {' '}
                  <span className={styles.dim}>{line.dim}</span>
                </>
              ) : null}
              {line.highlight ? (
                <>
                  {' '}
                  <span className={styles.hl}>{line.highlight}</span>
                </>
              ) : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

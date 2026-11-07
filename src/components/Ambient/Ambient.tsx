import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cx } from '@/lib/cx';
import styles from './Ambient.module.css';

const POINTER_QUERY = '(hover: hover) and (pointer: fine)';

/** How far the light moves toward the pointer each frame (0..1). */
const EASE = 0.12;

/**
 * Elements the cursor light tightens over. Global utility classes are matched by
 * name; the Skills chips, styled with CSS Modules, opt in with a `data-chip` attribute.
 */
const INTERACTIVE = 'a, button, .tag, .pill, [data-chip]';

/** True on devices with a hovering, precise pointer (mouse, trackpad). Updates live. */
function useFinePointer(): boolean {
  const [fine, setFine] = useState<boolean>(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(POINTER_QUERY).matches
      : false,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(POINTER_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      setFine(event.matches);
    };
    mq.addEventListener('change', onChange);
    return () => {
      mq.removeEventListener('change', onChange);
    };
  }, []);

  return fine;
}

/**
 * Fixed page chrome rendered first in the app: three blurred drifting orbs behind
 * everything, a 2px scroll-progress bar along the top edge, and a soft light that
 * lags behind the pointer on hover-capable devices. All three are decorative and
 * hidden from assistive technology; the system cursor is never hidden.
 */
export function Ambient() {
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const spotActive = finePointer && !reduced;

  const barRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const [spotOn, setSpotOn] = useState(false);
  const [spotHover, setSpotHover] = useState(false);

  // Scroll progress: width tracks the scroll fraction. Measured on scroll and
  // resize events only, never inside an animation frame.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const root = document.documentElement;

    const update = () => {
      const range = root.scrollHeight - window.innerHeight;
      const fraction = range > 0 ? window.scrollY / range : 0;
      bar.style.width = `${String(Math.min(100, Math.max(0, fraction * 100)))}%`;
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Cursor light: eases toward the pointer while it is moving, appears after the
  // first move, tightens over interactive elements and fades when the pointer leaves.
  useEffect(() => {
    if (!spotActive) return;
    const spot = spotRef.current;
    if (!spot) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let frame = 0;

    const loop = () => {
      x += (targetX - x) * EASE;
      y += (targetY - y) * EASE;
      spot.style.left = `${String(x)}px`;
      spot.style.top = `${String(y)}px`;
      const settled = Math.abs(targetX - x) + Math.abs(targetY - y) <= 0.5;
      frame = settled ? 0 : window.requestAnimationFrame(loop);
    };

    /** Starts the loop if it is idle; rAF handles are positive, so 0 means idle. */
    const kick = () => {
      if (frame === 0) frame = window.requestAnimationFrame(loop);
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      kick();
      setSpotOn(true);
      const over = event.target instanceof Element && event.target.closest(INTERACTIVE) !== null;
      setSpotHover(over);
    };

    const onLeave = () => {
      setSpotOn(false);
      setSpotHover(false);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    kick();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onLeave);
      setSpotOn(false);
      setSpotHover(false);
    };
  }, [spotActive]);

  return (
    <>
      <div className={cx(styles.ambient)} aria-hidden="true">
        <i className={cx(styles.orb, styles.o1)} />
        <i className={cx(styles.orb, styles.o2)} />
        <i className={cx(styles.orb, styles.o3)} />
      </div>
      <div className={cx(styles.progress)} aria-hidden="true">
        <i ref={barRef} className={cx(styles.bar)} />
      </div>
      {spotActive ? (
        <div
          ref={spotRef}
          className={cx(styles.spot, spotOn && styles.isOn, spotHover && styles.isHover)}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { profile } from '@/content/profile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cx } from '@/lib/cx';
import styles from './Hero.module.css';

/* Interface labels only; every piece of résumé copy, link and list comes from `profile`. */
const LABEL_WORK = 'View selected work';
const LABEL_CONTACT = 'Get in touch';
const LABEL_LINKEDIN = 'LinkedIn';
const LABEL_SAYS_HELLO = 'says hello';

const SCRAMBLE_CHARS = '01ABCDEFGHJKLMNPQRSTUVWXYZ<>/#_';
const SCRAMBLE_START_MS = 500;
const SCRAMBLE_STAGGER_MS = 250;
const SCRAMBLE_DURATION_MS = 900;
const SCRAMBLE_SAFETY_MS = 150;
const TYPE_START_MS = 1200;
const TYPE_TICK_MS = 20;

/**
 * Resolves `text` from random glyphs to its real characters, left to right,
 * over SCRAMBLE_DURATION_MS starting after `delay`. A safety timeout settles
 * the real text even if animation frames are throttled. Returns the real
 * text immediately when `enabled` is false and resets its state, so nothing
 * stale shows if the animation is enabled again later.
 */
function useScramble(text: string, delay: number, enabled: boolean): string {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!enabled || typeof window.requestAnimationFrame !== 'function') {
      setDisplay(text);
      return;
    }
    const length = text.length;
    let frame = 0;
    let startedAt: number | null = null;
    let done = false;

    const step = (now: number) => {
      if (done) return;
      startedAt ??= now;
      const progress = Math.min(1, (now - startedAt) / SCRAMBLE_DURATION_MS);
      if (progress >= 1) {
        done = true;
        setDisplay(text);
        return;
      }
      const out = Array.from(text, (char, index) => {
        if (char === ' ' || index / length < progress) return char;
        return SCRAMBLE_CHARS.charAt(Math.floor(Math.random() * SCRAMBLE_CHARS.length));
      }).join('');
      setDisplay(out);
      frame = window.requestAnimationFrame(step);
    };

    const startTimer = window.setTimeout(() => {
      frame = window.requestAnimationFrame(step);
    }, delay);
    const safetyTimer = window.setTimeout(() => {
      done = true;
      setDisplay(text);
    }, delay + SCRAMBLE_DURATION_MS + SCRAMBLE_SAFETY_MS);

    return () => {
      done = true;
      window.clearTimeout(startTimer);
      window.clearTimeout(safetyTimer);
      window.cancelAnimationFrame(frame);
    };
  }, [text, delay, enabled]);

  return enabled ? display : text;
}

/**
 * Renders `text` in full, then after TYPE_START_MS replays it as a typing
 * animation. `typing` is true while characters are still appearing, so the
 * caller can show a caret. Under reduced motion the full text stays put and
 * any in-progress replay is reset.
 */
function useTypewriter(text: string, enabled: boolean): { shown: string; typing: boolean } {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setCount(null);
      return;
    }
    let interval = 0;
    const startTimer = window.setTimeout(() => {
      let index = 0;
      setCount(0);
      interval = window.setInterval(() => {
        index += 1;
        if (index >= text.length) {
          window.clearInterval(interval);
          setCount(null);
        } else {
          setCount(index);
        }
      }, TYPE_TICK_MS);
    }, TYPE_START_MS);

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(interval);
    };
  }, [text, enabled]);

  if (!enabled || count === null) return { shown: text, typing: false };
  return { shown: text.slice(0, count), typing: true };
}

function clearTransforms(...elements: (HTMLElement | null)[]): void {
  for (const element of elements) {
    if (element) element.style.transform = '';
  }
}

interface ScramblePartProps {
  text: string;
  accent: boolean;
  delay: number;
  enabled: boolean;
}

/**
 * One headline part. Hidden from assistive technology because its text mutates
 * while scrambling; the <h1> carries a visually hidden plain copy instead.
 */
function ScramblePart({ text, accent, delay, enabled }: ScramblePartProps) {
  const shown = useScramble(text, delay, enabled);
  return <span className={accent ? 'grad' : undefined} aria-hidden="true">{shown}</span>;
}

/**
 * The page header: eyebrow, scrambling headline, lede, calls to action and
 * meta on the left; the tilting portrait with chips and the typed greeting
 * bubble on the right. The headline keeps a visually hidden plain copy so its
 * accessible name never reads as glyphs, and the greeting reserves the full
 * text's height so the replay does not shift the layout. All motion is skipped
 * under reduced motion.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const portraitRef = useRef<HTMLDivElement>(null);
  const chipTopRef = useRef<HTMLDivElement>(null);
  const chipBottomRef = useRef<HTMLDivElement>(null);
  const greeting = useTypewriter(profile.greeting, !reduced);
  const headlineText = profile.headline.map((part) => part.text).join('');
  const firstName = profile.name.split(/\s+/)[0] ?? profile.name;
  const portraitSrc = `${import.meta.env.BASE_URL}${profile.portrait.src}`;

  // Drop any tilt left on the portrait if the visitor turns reduced motion on.
  useEffect(() => {
    if (!reduced) return;
    clearTransforms(portraitRef.current, chipTopRef.current, chipBottomRef.current);
  }, [reduced]);

  const onHeroPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const hero = event.currentTarget;
    const rect = hero.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const mx = ((event.clientX - rect.left) / rect.width) * 100;
    const my = ((event.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty('--mx', `${String(mx)}%`);
    hero.style.setProperty('--my', `${String(my)}%`);
  };

  const onStagePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const portrait = portraitRef.current;
    if (!portrait) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateX = (-y * 10).toFixed(2);
    const rotateY = (x * 12).toFixed(2);
    portrait.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    const top = chipTopRef.current;
    if (top) top.style.transform = `translate(${(x * 14).toFixed(1)}px, ${(y * 12).toFixed(1)}px)`;
    const bottom = chipBottomRef.current;
    if (bottom) {
      bottom.style.transform = `translate(${(x * -10).toFixed(1)}px, ${(y * -8).toFixed(1)}px)`;
    }
  };

  const onStagePointerLeave = () => {
    clearTransforms(portraitRef.current, chipTopRef.current, chipBottomRef.current);
  };

  return (
    <header className={styles.hero} id="top" onPointerMove={onHeroPointerMove}>
      <div className={cx(styles.orb, styles.orbA)} aria-hidden="true" />
      <div className={cx(styles.orb, styles.orbB)} aria-hidden="true" />
      <div className={styles.bgrid} aria-hidden="true" />
      <div className={cx('wrap', styles.grid)}>
        <div>
          <div className={cx(styles.eyebrow, 'seq', 'seq-1')}>{profile.eyebrow}</div>
          <h1 className={cx(styles.title, 'seq', 'seq-2')}>
            <span className={styles.srOnly}>{headlineText}</span>
            {profile.headline.map((part, index) => (
              <ScramblePart
                key={`${String(index)}-${part.text}`}
                text={part.text}
                accent={part.accent ?? false}
                delay={SCRAMBLE_START_MS + index * SCRAMBLE_STAGGER_MS}
                enabled={!reduced}
              />
            ))}
          </h1>
          <p className={cx(styles.lede, 'seq', 'seq-3')}>{profile.lede}</p>
          <div className={cx(styles.cta, 'seq', 'seq-4')}>
            <a className="btn btn-primary" href="#work">
              {LABEL_WORK}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="btn" href="#contact">
              {LABEL_CONTACT}
            </a>
            <a
              className="btn"
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              {LABEL_LINKEDIN}
            </a>
          </div>
          <div className={cx(styles.meta, 'seq', 'seq-5')}>
            {profile.meta.map((item) => (
              <div key={item.label}>
                <b className={styles.metaLabel}>{item.label}</b>
                {' · '}
                {item.value}
              </div>
            ))}
          </div>
        </div>

        <div className={cx(styles.core, 'seq', 'seq-5')}>
          <div
            className={styles.pcol}
            onPointerMove={onStagePointerMove}
            onPointerLeave={onStagePointerLeave}
          >
            <div className={styles.portrait} ref={portraitRef}>
              <img
                className={styles.photo}
                src={portraitSrc}
                alt={profile.portrait.alt}
                decoding="async"
              />
              <div className={cx(styles.chip, styles.chipTop)} ref={chipTopRef}>
                <span className={styles.dot} aria-hidden="true" />
                {profile.portrait.topChip}
              </div>
              <div className={cx(styles.chip, styles.chipBottom)} ref={chipBottomRef}>
                <b className={styles.chipName}>{profile.name}</b>
                <span className={styles.chipRole}>{profile.portrait.roleChip}</span>
              </div>
            </div>
          </div>
          <div className={styles.bubble}>
            <div className={styles.who}>
              <span className={styles.whoDot} aria-hidden="true" />
              {`${firstName} · ${LABEL_SAYS_HELLO}`}
            </div>
            <p className={styles.greet}>
              <span className={styles.greetSizer} aria-hidden="true">{profile.greeting}</span>
              <span className={styles.greetLive}>
                {greeting.shown}
                {greeting.typing ? <span className="caret" aria-hidden="true" /> : null}
              </span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

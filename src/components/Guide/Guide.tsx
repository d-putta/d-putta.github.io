import { useEffect, useId, useRef, useState } from 'react';
import { profile } from '@/content/profile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cx } from '@/lib/cx';
import styles from './Guide.module.css';

/* Interface labels only; the name, greeting and portrait come from `profile`. */
const LABEL_MEET = 'Meet';
const LABEL_SAYS_HELLO = 'says hello';
const LABEL_WELCOME_FROM = 'Welcome from';
const LABEL_CLOSE = 'Close';
const LABEL_REPLAY = 'Replay';
const LABEL_CONTACT = 'Get in touch';
/** In-page anchor of the contact section; a plain hash so it works at any base path. */
const CONTACT_HREF = '#contact';

/** The hero landmark's id; the guide stays hidden while the hero is on screen. */
const HERO_ID = 'top';
/** The hero counts as on screen while its bottom edge is below this fraction of the viewport. */
const HERO_CLEARANCE = 0.08;
/** Window event the systems map dispatches with `detail: boolean` as it expands or collapses. */
const MAP_EXPANDED_EVENT = 'map:expanded';
/** Milliseconds per typed character. */
const TYPE_TICK_MS = 20;

/** First name from `profile.name`, e.g. "Deepak" from "Deepak Putta". */
const firstName = profile.name.trim().split(/\s+/)[0] ?? profile.name;
const labelMeet = `${LABEL_MEET} ${firstName}`;

interface TypewriterProps {
  text: string;
  /** False under reduced motion: the whole text renders at once and no timer runs. */
  animate: boolean;
}

/**
 * Types `text` one character per TYPE_TICK_MS behind a caret, as the prototype
 * does; remount it (change its key) to replay. With `animate` false the full
 * text is shown immediately.
 */
function Typewriter({ text, animate }: TypewriterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!animate) return;
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setCount(index);
      if (index >= text.length) window.clearInterval(interval);
    }, TYPE_TICK_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [text, animate]);

  if (!animate) return <>{text}</>;
  return (
    <>
      {text.slice(0, count)}
      {count < text.length ? <span className="caret" aria-hidden="true" /> : null}
    </>
  );
}

/**
 * "Meet Deepak": a floating widget fixed bottom-right. It stays hidden while the
 * hero is on screen or the systems map is expanded. The round portrait button
 * opens a small glass dialog that types the greeting, with Replay and a link to
 * the contact section; Escape or the × button closes it.
 */
export function Guide() {
  const reduced = useReducedMotion();
  const cardId = useId();
  const [heroAway, setHeroAway] = useState(false);
  const [mapExpanded, setMapExpanded] = useState<boolean>(
    () => typeof document !== 'undefined' && document.body.dataset.mapExpanded === 'true',
  );
  const [open, setOpen] = useState(false);
  const [run, setRun] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const visible = heroAway && !mapExpanded;

  // Hero visibility, measured on scroll and resize (and once after mount), never
  // inside an animation frame. The card closes whenever the hero comes back.
  useEffect(() => {
    const check = () => {
      const hero = document.getElementById(HERO_ID);
      const heroOnScreen =
        hero !== null &&
        hero.getBoundingClientRect().bottom > window.innerHeight * HERO_CLEARANCE;
      setHeroAway(!heroOnScreen);
      if (heroOnScreen) setOpen(false);
    };

    const initial = window.setTimeout(check, 0);
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);

    return () => {
      window.clearTimeout(initial);
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  // The systems map announces expand/collapse; the guide hides (and closes) while it is big.
  useEffect(() => {
    const onMapExpanded = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const detail: unknown = event.detail;
      const expanded = detail === true;
      setMapExpanded(expanded);
      if (expanded) setOpen(false);
    };

    window.addEventListener(MAP_EXPANDED_EVENT, onMapExpanded);
    return () => {
      window.removeEventListener(MAP_EXPANDED_EVENT, onMapExpanded);
    };
  }, []);

  // Escape closes the card while it is open. Focus returns to the toggle when it
  // was inside the card, which is display:none once hidden (the dialog pattern).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      if (cardRef.current?.contains(document.activeElement)) toggleRef.current?.focus();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const toggle = () => {
    setOpen((current) => !current);
  };
  const close = () => {
    setOpen(false);
    if (cardRef.current?.contains(document.activeElement)) toggleRef.current?.focus();
  };
  const replay = () => {
    setRun((current) => current + 1);
  };

  return (
    <div className={cx(styles.guide, visible && styles.show, open && styles.open)}>
      <div
        ref={cardRef}
        id={cardId}
        className={cx(styles.card)}
        role="dialog"
        aria-label={`${LABEL_WELCOME_FROM} ${firstName}`}
        hidden={!open}
      >
        <div className={cx(styles.head)}>
          <div className={cx(styles.who)}>
            <i className={cx(styles.dot)} aria-hidden="true" />
            {`${firstName} · ${LABEL_SAYS_HELLO}`}
          </div>
          <button
            type="button"
            className={cx(styles.close)}
            aria-label={LABEL_CLOSE}
            onClick={close}
          >
            ×
          </button>
        </div>
        <p className={cx(styles.text)}>
          {open ? <Typewriter key={run} text={profile.greeting} animate={!reduced} /> : null}
        </p>
        <div className={cx(styles.actions)}>
          <button type="button" className="btn btn-small" onClick={replay}>
            {LABEL_REPLAY}
          </button>
          <a className="btn btn-primary btn-small" href={CONTACT_HREF} onClick={close}>
            {LABEL_CONTACT}
          </a>
        </div>
      </div>
      <button
        ref={toggleRef}
        type="button"
        className={cx(styles.toggle)}
        aria-label={labelMeet}
        aria-expanded={open}
        aria-controls={cardId}
        onClick={toggle}
      >
        <span className={cx(styles.label)} aria-hidden="true">
          {labelMeet}
        </span>
        <img
          className={cx(styles.face)}
          src={`${import.meta.env.BASE_URL}${profile.portrait.src}`}
          alt=""
        />
      </button>
    </div>
  );
}

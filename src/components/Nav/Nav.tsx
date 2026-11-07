import { useEffect, useRef, useState } from 'react';
import { profile } from '@/content/profile';
import { cx } from '@/lib/cx';
import styles from './Nav.module.css';

const LINKS_ID = 'nav-links';

/** The prototype's observer band: a strip from 40% to 45% of the viewport height. */
const ROOT_MARGIN = '-40% 0px -55% 0px';
const BAND_TOP = 0.4;
const BAND_BOTTOM = 0.45;

/**
 * Sticky glass navigation: brand mark, section links with an active-section
 * highlight, the live status chip and a hamburger-driven dropdown on small screens.
 */
export function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Highlight the link whose section currently crosses the observer band.
  useEffect(() => {
    const targets = profile.nav
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;

    if (typeof IntersectionObserver === 'function') {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setActive(`#${entry.target.id}`);
          }
        },
        { rootMargin: ROOT_MARGIN },
      );
      for (const target of targets) observer.observe(target);
      return () => {
        observer.disconnect();
      };
    }

    // Fallback: measure on scroll and resize events only, never inside a frame loop.
    const update = () => {
      const bandTop = window.innerHeight * BAND_TOP;
      const bandBottom = window.innerHeight * BAND_BOTTOM;
      for (const target of targets) {
        const rect = target.getBoundingClientRect();
        if (rect.top < bandBottom && rect.bottom > bandTop) {
          setActive(`#${target.id}`);
          return;
        }
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // While the dropdown is open: close on outside click and on Escape.
  useEffect(() => {
    if (!open) return;

    const onDocumentClick = (event: MouseEvent) => {
      const nav = navRef.current;
      if (nav && event.target instanceof Node && !nav.contains(event.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuRef.current?.focus();
      }
    };

    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const toggleMenu = () => {
    setOpen((value) => !value);
  };
  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <nav ref={navRef} className={cx(styles.nav, open && styles.open)} aria-label="Primary">
      <div className={cx('wrap', styles.bar)}>
        <a className={cx(styles.brand)} href="#top">
          <span className={cx(styles.mark)} aria-hidden="true">
            <span className={cx(styles.initials)}>{profile.initials}</span>
          </span>
          {profile.name}
        </a>

        <div className={cx(styles.status)}>
          <span className={cx(styles.dot)} aria-hidden="true" />
          <span>{profile.roleShort}</span>
        </div>

        <button
          ref={menuRef}
          className={cx(styles.menu)}
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls={LINKS_ID}
          onClick={toggleMenu}
        >
          <span className={cx(styles.menuLine)} aria-hidden="true" />
          <span className={cx(styles.menuLine)} aria-hidden="true" />
          <span className={cx(styles.menuLine)} aria-hidden="true" />
        </button>

        {/* Placed after its toggle so Tab enters the opened dropdown; on wide screens the
            stylesheet's flex `order` keeps the links between the brand and the status chip. */}
        <div className={cx(styles.links)} id={LINKS_ID}>
          <span className={cx(styles.role)}>{profile.role}</span>
          {profile.nav.map((link) => {
            const isActive = link.href === active;
            return (
              <a
                key={link.href}
                className={cx(styles.link, isActive && styles.active)}
                href={link.href}
                aria-current={isActive ? 'true' : undefined}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

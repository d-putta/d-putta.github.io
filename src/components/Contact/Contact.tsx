import { Fragment } from 'react';
import { Reveal } from '@/components/Reveal/Reveal';
import { profile } from '@/content/profile';
import { cx } from '@/lib/cx';
import { buildMailto } from '@/lib/email';
import styles from './Contact.module.css';

const HEADING_ID = 'contact-title';

/** Small UI labels for this section; the résumé content itself comes from `profile`. */
const EMAIL_LABEL = 'Email';
const LINKEDIN_LABEL = 'Message on LinkedIn';

/**
 * Closing call to action: a glass panel with a slowly drifting mesh glow, the
 * contact headline and two actions. The mailto address is assembled at runtime
 * by `buildMailto`, so it never appears as plain text in the markup. The mesh
 * is pure CSS and only animates when the visitor has not asked for reduced motion.
 */
export function Contact() {
  const { address, href } = buildMailto(profile.email);

  return (
    <section className={cx(styles.contact)} id="contact" aria-labelledby={HEADING_ID}>
      <div className={cx(styles.glowline)} aria-hidden="true" />
      <div className={cx('wrap', styles.grid)}>
        <Reveal className={cx(styles.panel)}>
          <div className={cx(styles.mesh)} aria-hidden="true" />
          <div className={cx('mono', styles.label)}>{`// ${profile.contact.index}`}</div>
          <h2 className={cx(styles.title)} id={HEADING_ID}>
            {profile.contact.headline.map((part, i) =>
              part.accent ? (
                <span className="grad" key={`${part.text}-${String(i)}`}>
                  {part.text}
                </span>
              ) : (
                <Fragment key={`${part.text}-${String(i)}`}>{part.text}</Fragment>
              ),
            )}
          </h2>
          <div className={cx(styles.row)}>
            <a
              className="btn btn-primary"
              id="emailLink"
              href={href}
              aria-label={`${EMAIL_LABEL} ${address}`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              {EMAIL_LABEL}
            </a>
            <a
              className="btn"
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              {LINKEDIN_LABEL}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

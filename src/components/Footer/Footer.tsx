import { profile } from '@/content/profile';
import { cx } from '@/lib/cx';
import styles from './Footer.module.css';

/**
 * Site footer: a single mono line with the copyright on the left and the
 * role line on the right. It is static (no effects, no motion), and below
 * 1348px the inner wrap reserves bottom clearance so the floating guide
 * never covers the text.
 */
export function Footer() {
  return (
    <footer className={cx(styles.footer)}>
      <div className={cx('wrap', styles.inner)}>
        <div>{profile.footer.copyright}</div>
        <div>{profile.footer.line}</div>
      </div>
    </footer>
  );
}

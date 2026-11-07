import { useEffect, useState, type RefObject } from 'react';

interface Options {
  /** Fraction of the element that must be visible. Default 0.15. */
  threshold?: number;
  /** Stop observing after the first time it is visible. Default true. */
  once?: boolean;
}

function isOnScreen(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  // An element with no layout box (hidden container, test environment) counts as
  // visible so content is never held back by a missing measurement.
  if (rect.width === 0 && rect.height === 0) return true;
  return rect.top < window.innerHeight * 0.96 && rect.bottom > 0;
}

/**
 * Reports whether `ref` is in the viewport. Uses IntersectionObserver when
 * available and falls back to geometry checks on scroll and resize, so a
 * window resized to phone width never leaves elements undetected.
 */
export function useInView(ref: RefObject<Element | null>, options: Options = {}): boolean {
  const { threshold = 0.15, once = true } = options;
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (once && inView) return;

    let observer: IntersectionObserver | undefined;
    const check = () => {
      if (isOnScreen(element)) setInView(true);
    };

    if (typeof IntersectionObserver === 'function') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setInView(true);
            else if (!once) setInView(false);
          }
        },
        { threshold, rootMargin: '0px 0px -5% 0px' },
      );
      observer.observe(element);
    }

    const timer = window.setTimeout(check, 300);
    const interval = window.setInterval(check, 500);
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);

    return () => {
      observer?.disconnect();
      window.clearTimeout(timer);
      window.clearInterval(interval);
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, [ref, threshold, once, inView]);

  return inView;
}

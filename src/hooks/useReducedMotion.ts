import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** True when the visitor asked the OS to reduce motion. Updates live. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(QUERY).matches
      : false,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };
    mq.addEventListener('change', onChange);
    return () => {
      mq.removeEventListener('change', onChange);
    };
  }, []);

  return reduced;
}

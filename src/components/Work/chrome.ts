/**
 * Fixed strings that belong to the mock panels' UI chrome (a scan status badge,
 * a terminal "live" indicator), not to the résumé. Everything about the person,
 * the projects and their links lives in `@/content/profile`.
 */
export const chrome = {
  a11y: {
    /** Status shown next to every scanned repository. */
    status: '0 critical',
    /** Label of the coverage row; its value is `visual.coverageLabel`. */
    coverage: 'repos covered',
  },
  console: {
    /** Badge in the console title bar. */
    live: 'live',
  },
} as const;

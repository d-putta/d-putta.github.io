/** Shapes for everything editable on the site. Edit `profile.ts`, not components. */

export interface NavLink {
  href: `#${string}`;
  label: string;
}

export interface HeadlinePart {
  text: string;
  accent?: boolean;
}

export interface Metric {
  value: string;
  /** Numeric target for the count-up animation; omit for non-numeric values. */
  countTo?: number;
  unit?: string;
  label: string;
}

export type FocusIcon = 'agents' | 'architecture' | 'cloud';

export interface FocusArea {
  icon: FocusIcon;
  title: string;
  description: string;
  tags: readonly string[];
}

export interface Outcome {
  value: string;
  label: string;
}

export type ProjectVisual =
  | { kind: 'pipeline'; stages: readonly string[] }
  | { kind: 'a11y'; repos: readonly string[]; coverageLabel: string }
  | {
      kind: 'arch';
      edge: string;
      core: readonly { title: string; sub: string }[];
      stores: readonly string[];
      base: string;
    }
  | { kind: 'console'; title: string; command: string; lines: readonly ConsoleLine[] };

export interface ConsoleLine {
  status: 'step' | 'ok';
  tool: string;
  value: string;
  dim?: string;
  highlight?: string;
}

export interface Project {
  id: string;
  featured?: boolean;
  pills: readonly { label: string; tone?: 'live' | 'accent' }[];
  title: string;
  description: string;
  outcomes: readonly Outcome[];
  stack: readonly string[];
  visual: ProjectVisual;
}

export interface SkillGroup {
  title: string;
  items: readonly string[];
}

export interface Certification {
  code: string;
  badge: readonly [string, string];
  title: string;
  date: string;
  highlight?: boolean;
}

export interface Concept {
  name: string;
  description: string;
}

export interface ConceptGroup {
  group: string;
  /** The first concept is the group's hub node. */
  concepts: readonly Concept[];
}

export interface Profile {
  name: string;
  initials: string;
  role: string;
  roleShort: string;
  eyebrow: string;
  headline: readonly HeadlinePart[];
  lede: string;
  greeting: string;
  portrait: { src: string; alt: string; topChip: string; roleChip: string };
  meta: readonly { label: string; value: string }[];
  links: { linkedin: string };
  /** Assembled at runtime so the address never appears as plain text in markup. */
  email: { user: string; domain: string; tld: string; subject: string };
  nav: readonly NavLink[];
  ticker: readonly string[];
  metrics: readonly Metric[];
  focus: { index: string; title: string; blurb: string; areas: readonly FocusArea[] };
  work: { index: string; title: string; blurb: string; projects: readonly Project[] };
  skills: { index: string; title: string; blurb: string; groups: readonly SkillGroup[] };
  credentials: { index: string; title: string; blurb: string; items: readonly Certification[] };
  contact: { index: string; headline: readonly HeadlinePart[] };
  systemsMap: { core: Concept; groups: readonly ConceptGroup[] };
  footer: { copyright: string; line: string };
}

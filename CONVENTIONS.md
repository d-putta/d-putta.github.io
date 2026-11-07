# Conventions

This file exists so every component in the project reads as if one engineer wrote it.

## Layout

```
src/
  App.tsx                  page composition only, no styling
  content/profile.ts       ALL copy, links, lists. Components never hard-code text.
  content/types.ts         the shapes profile.ts must satisfy
  components/<Name>/       <Name>.tsx + <Name>.module.css (+ small helpers, tests)
  hooks/                   reusable behaviour (useInView, useReducedMotion)
  lib/                     pure functions (cx, email)
  styles/tokens.css        every color, font and radius token
  styles/global.css        base styles and shared utility classes
```

## Rules

- **Content comes from `profile`.** Import `{ profile } from '@/content/profile'`; never
  inline résumé text, links or labels in a component.
- **Named exports only**, one component per folder, function components, no default exports.
- **TypeScript strict**: no `any`, no non-null assertions, narrow unions explicitly.
  `noUncheckedIndexedAccess` is on, so index results are possibly `undefined`.
- **Styling**: CSS Modules per component. Use tokens from `tokens.css` for every color,
  font and radius; never a literal color. Shared utilities (`.wrap`, `.btn`, `.btn-primary`,
  `.btn-small`, `.tag`, `.pill`, `.pill-live`, `.pill-accent`, `.mono`, `.num`, `.grad`,
  `.caret`, `.glass`) live in `global.css` and are used by class name.
- **Motion**: read `useReducedMotion()` and skip canvas loops, typing effects and
  tilts when it is true. Keep every CSS animation inside `@media (prefers-reduced-motion: no-preference)`
  or rely on the global reduced-motion override in `global.css`.
- **Reveal on scroll**: wrap blocks in `<Reveal>` (or `<Reveal as="article">`) from
  `@/components/Reveal/Reveal`. Pass `delay` in ms for staggering siblings. Content is
  always readable without JS.
- **Cards**: use `<Card>` from `@/components/Card/Card` for glass panels. Pass `tilt`
  for the 3D hover effect. Add component-specific layout in the component's own module.
- **Sections**: `Focus`, `Work`, `Skills`, `Credentials` render only their inner content;
  `App.tsx` wraps them in `<Section>` which provides the heading rail.
- **Accessibility**: semantic landmarks, `aria-label` on icon-only buttons, visible focus,
  `aria-hidden` on decorative canvases and SVGs, no text in canvas that is not also in the DOM.
  A `ul`/`ol` styled with `list-style: none` gets `role="list"` (Safari drops list semantics
  otherwise); the ESLint config allows that one redundant role.
  Section rail labels live in `profile.ts` (`index`); small chrome labels are component constants.
- **No side effects at module scope.** Effects live in `useEffect` with full cleanup.
- **Browser safety**: guard `window.matchMedia`, `IntersectionObserver`, canvas
  `getContext` (may return `null`) and never read `offsetWidth` inside an animation frame loop.
- **Formatting**: Prettier (2 spaces, single quotes, trailing commas, width 100). Run
  `npm run format` before committing.

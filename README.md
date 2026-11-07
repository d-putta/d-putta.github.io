# Deepak Putta · Portfolio

Personal portfolio of Deepak Putta, Senior Software Engineer working on AI agents, MCP
servers, and distributed platforms. A single-page site built with Vite, React 18 and
TypeScript, deployed to GitHub Pages by GitHub Actions.

## Stack

| Concern    | Choice                                                     |
| ---------- | ---------------------------------------------------------- |
| UI         | React 18, TypeScript (strict), CSS Modules + design tokens |
| Build      | Vite                                                       |
| Quality    | ESLint (typescript-eslint, jsx-a11y), Prettier, Vitest + Testing Library, axe-core |
| Deploy     | GitHub Actions → GitHub Pages                              |

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

The first `npm install` creates `package-lock.json`. Commit it: it pins exact versions,
and the workflows can then switch from `npm install` to `npm ci`.

Other scripts:

```bash
npm run check      # lint + typecheck + tests + production build
npm run build      # production build into dist/
npm run preview    # serve dist/ locally
npm run format     # Prettier
```

Node 22 is pinned in `.nvmrc`.

## Updating content

Everything a visitor reads lives in one typed file: `src/content/profile.ts`. Change a
line there, commit, push to `main`, and the site redeploys. The shapes are in
`src/content/types.ts`, so a typo in a field name fails the build instead of shipping.

- Portrait: replace `public/avatar.png` (square PNG with transparent background).
- Favicon: `public/favicon.svg`.
- Canonical URL, social preview image, sitemap and robots: replace `USERNAME.github.io`
  in `index.html` (canonical link and `og:image`), `public/sitemap.xml` and
  `public/robots.txt` with your GitHub Pages URL.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`: lint, typecheck, tests,
build, then publish `dist/` to GitHub Pages. The workflow sets the Vite `base` path
automatically: `/` for a user site named `<username>.github.io`, `/<repo>/` for any
other repository name.

One-time setup in the repository: **Settings → Pages → Build and deployment → Source:
GitHub Actions**.

`.github/workflows/ci.yml` runs the same checks on pull requests and non-main branches.

## Structure

```
src/
  App.tsx               page composition
  content/              typed content (edit here)
  components/           one folder per component, CSS Modules alongside
  hooks/                useInView, useReducedMotion
  lib/                  small pure helpers
  styles/               tokens.css (design tokens), global.css (base + utilities)
public/                 static assets copied as-is
```

See `CONVENTIONS.md` for the coding rules the project follows.

## License

Code is MIT licensed. Text, portrait and other personal content are © Deepak Putta.
# deepakputta
# deepakputta

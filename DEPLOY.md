# Hosting on GitHub Pages

The site deploys itself: every push to `main` runs the workflow in
`.github/workflows/deploy.yml`, which lints, type-checks, tests, builds, and publishes
to GitHub Pages. You never build or upload `dist/` by hand.

## 1. Create the repository

1. Sign in to GitHub with your personal account.
2. Click **New repository**.
3. Name it exactly `<your-username>.github.io` (lowercase). This makes the site live at
   `https://<your-username>.github.io/` with no path after the slash.
   Any other name also works; the site would then live at
   `https://<your-username>.github.io/<repo-name>/` and the workflow adjusts the paths
   automatically.
4. Visibility: **Public** (GitHub Pages on a free account requires a public repo).
5. Leave "Add a README", ".gitignore" and "license" unchecked. Create the repository.

## 2. Put the project in the repository

Pick one of the two routes.

### Route A: GitHub Desktop (no terminal)

1. Install GitHub Desktop and sign in with the same personal account.
2. **File → Add local repository** and choose this project folder. When it says the
   folder is not a Git repository, click **Create a repository**.
3. In the first commit box type `Initial portfolio` and click **Commit to main**.
4. Click **Publish repository**, pick the repository you created in step 1, make sure
   "Keep this code private" is **unchecked**, and publish.

### Route B: Terminal

Run these inside the project folder, replacing `<your-username>`:

```bash
git init -b main
git add .
git commit -m "Initial portfolio"
git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
git push -u origin main
```

If the push asks for a password, use a GitHub personal access token (Settings →
Developer settings → Personal access tokens) with the `repo` and `workflow` scopes.
A normal account password is not accepted.

Avoid uploading through the GitHub website: the drag-and-drop uploader skips the
hidden `.github` folder that contains the deploy workflow.

## 3. Turn on GitHub Pages (one time)

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Open the **Actions** tab. A run named "Deploy to GitHub Pages" should already be
   running from your first push (if it is waiting for approval, click **Approve**).
4. When it turns green, the site is live at `https://<your-username>.github.io/`.
   The first deploy can take two or three minutes.

## 4. Finish the metadata

Replace the placeholder `USERNAME.github.io` with your real address in:

- `index.html` (the `canonical` link and the `og:image` meta)
- `public/sitemap.xml`
- `public/robots.txt`

Commit and push. The site redeploys on its own.

## Updating the site later

1. Edit `src/content/profile.ts` (all text, links and lists live there) or replace
   `public/avatar.png`.
2. Commit and push to `main`.
3. Watch the Actions tab; the site updates when the run is green.

To preview locally before pushing: `npm install` once, then `npm run dev`. Commit the
`package-lock.json` that the install creates; it pins exact versions for every future build.

## If a deploy fails

Open the failed run in the Actions tab. The step that failed tells you which check
broke: `lint`, `typecheck`, `test` or `build`. Run `npm run check` locally to see the
same output, fix it, and push again.

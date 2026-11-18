# Abhirup Sarkar's portfolio

React, TypeScript, and Vite portfolio published at **https://abhirup-glich.github.io/**.

## GitHub Pages deployment

In this repository's **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**. This is a one-time repository setting.

The `Deploy portfolio to GitHub Pages` workflow runs on every push to `main`, or manually from the Actions tab. It installs the locked dependencies with Node.js 24, checks the static data export, builds the app, and deploys only `dist/` using GitHub's Pages actions. No deployment secret or custom domain is needed.

The Vite base is `/` because this repository is the user's root site.

## Content updates

Edit `data/portfolio-store.json` and push to `main` to publish changes. The Pages build exports startup data and only published projects, ordered by `display_order`, into static JSON files. The public site reads those files instead of calling server APIs. The existing external project feed continues to work.

GitHub Pages hosts static files and cannot run the `api/` backend or Google sign-in. On Pages, `/admin/` links to the repository content editor. The existing backend and admin portal remain available when running on a server-capable host.

## Local development

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
```

For a production Pages preview:

```sh
npm run build:pages
npm run preview
```

Validation:

```sh
node --test scripts/prepare-pages.test.mjs
npm test
npm run build:pages
```

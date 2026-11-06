# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A SvelteKit 3 / Svelte 5 app (JSDoc types, pnpm) that now hosts two things:

- **The portfolio site** (migrated from the former `svelte-test/` project) at `/`: `src/routes/+page.svelte` plus `src/lib/components/*` (ParallaxSlider, SlidingIntro, SplitLanding, PopUp, ...), `svelte-i18n` strings in `src/lib/components/i18n/`, and media in `static/images` and `static/videos` (~350 MB, not git-ignored). It is written in **Svelte 3 syntax**, so every one of those files starts with `<svelte:options runes={false} />` to opt out of the project-wide forced runes mode (`vite.config.js`). Keep that line when editing them, and write new components with runes.
- **The book page turn icon** prototype in `book.html`, not yet ported to a Svelte component.

Deployment is on Netlify via `@sveltejs/adapter-netlify` (output in `build/`). Build with Node 24 (the shell default here is Node 25): `env PATH="/opt/homebrew/opt/node@24/bin:$PATH" pnpm build`.

The git root is `~/Documents/Code`, a much larger parent repo, so scope `git` commands to this directory.

## Commands

- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm check` — `svelte-kit sync` + `svelte-check` against `jsconfig.json` (currently reports ~100 implicit-any errors from the untyped legacy portfolio code)
- `pnpm lint` — `prettier --check . && eslint .`; `pnpm format` to fix
- `pnpm test:unit` — Vitest (watch); `pnpm test:unit -- --run` for one-shot
- Single test: `pnpm test:unit -- --run src/lib/vitest-examples/greet.spec.js` (add `-t "<name>"` for one case)
- `pnpm test:e2e` — Playwright, builds and serves `preview` on port 4173; matches `**/*.e2e.{ts,js}` (e.g. `src/routes/page.svelte.e2e.js`)
- DB: `pnpm db:push | db:generate | db:migrate | db:studio` (Drizzle, dialect `turso`)
- `pnpm auth:schema` — regenerates the Better Auth Drizzle schema into `src/lib/server/db/auth.schema.js`

## Architecture

- **Vitest has two projects** (`vite.config.js`): `client` runs `src/**/*.svelte.{test,spec}.{js,ts}` in headless Chromium via `@vitest/browser-playwright`; `server` runs all other `src/**/*.{test,spec}.{js,ts}` in Node. The `.svelte.` infix in the filename decides which environment a test runs in. Tests must contain assertions (`requireAssertions: true`).
- **Request pipeline** (`src/hooks.server.js`): `sequence(handleParaglide, handleBetterAuth)`. Paraglide resolves locale and substitutes `%paraglide.lang%` / `%paraglide.dir%` in `src/app.html`; Better Auth then loads the session into `event.locals.user` / `event.locals.session` and mounts its handler. `src/hooks.js` `reroute` strips the locale prefix from URLs so routes are written locale-free.
- **i18n**: two systems coexist. The portfolio uses `svelte-i18n` (`initI18n()` in `+page.svelte`); the scaffold uses Paraglide with `en` and `fr`; strings live in `messages/*.json`, config in `project.inlang/`. The compiled runtime is generated into `src/lib/paraglide` by the Vite plugin (don't edit it; import via `#lib/paraglide/...`).
- **Auth/DB**: Better Auth (email/password + GitHub) in `src/lib/server/auth.js`, backed by Drizzle + libSQL in `src/lib/server/db/` (`schema.js` re-exports `auth.schema.js`). All env vars are optional: `db` is `null` without `DATABASE_URL`, and `auth` is `null` unless both the DB and `BETTER_AUTH_SECRET` are set. In that case the hook skips session loading and the `/demo/better-auth` routes return 503. GitHub sign-in is only registered when both GitHub credentials are set. Env vars are declared in `src/env.js` via `defineEnvVars` and imported from `$app/env/private`; copy `.env.example` to `.env`. The auth demo lives under `src/routes/demo/`, whose own `+layout.svelte` renders the sticky-note `DemoLinks` (there is no root layout).
- **Import aliases**: `#lib` and `#lib/*` map to `src/lib` through `package.json` `imports`; `$lib` was removed in Kit 3, so use `#lib` everywhere.
- `auth-schema.ts` at the repo root is a stray generated Better Auth schema; the live one is under `src/lib/server/db/`.

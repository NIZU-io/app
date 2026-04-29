# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NIZU is a Cloud SaaS app interface (nizu.io). This repo contains the frontend UI layer, currently in **alpha** (version 1.25). There is no build system — all assets are plain HTML/CSS/JS served directly.

## Repository Layout

```
platforms/
  desktop/
    app/              ← the actual app files served at /app/
      index.html
      assets/css/     ← nizu.css (entry), nizu_init.css (vars/base), bulma.min.css, all.min.css (FontAwesome)
      assets/js/      ← nizu_init.js (app logic), jQuery 3.7.1, jquery.validate, i18next
      assets/images/  ← logos/
      locales/en.json ← i18n strings (i18next)
    appfiles.json     ← maps virtual paths (/app/...) to local file paths for deployment
  mobile/             ← planned; also covers tablet (not yet in repo)
version.json          ← version number, release name, SHA-256 hashes of desktop/mobile bundles
```

## Key Conventions

**`appfiles.json`** — the deployment manifest. Every new file added to `platforms/desktop/app/` must be registered here with its virtual path (`/app/...`) mapped to its relative local path. The SHA-256 hash in `version.json` (`hash_desktop_files`) must be updated whenever the file set changes.

**`version.json`** — bump `version` (float, e.g. `1.25 → 1.26`) and update `hash_desktop_files` / `hash_mobile_files` with the new SHA-256 of the bundled file set when shipping a release.

**CSS architecture** — `nizu.css` is the entry point; it imports `bulma.min.css`, `all.min.css` (FontAwesome), and `nizu_init.css` in order. Design tokens live in `nizu_init.css` as CSS custom properties on `:root`, with both `prefers-color-scheme: light` and `dark` overrides. Always use the `--nizu-*` variables rather than hard-coded colors.

**i18n** — all user-visible strings go through i18next. Add new keys to `locales/en.json` under `values`. Do not hard-code English text in HTML.

**No build step** — there is no package.json, bundler, or test runner. Open `platforms/desktop/app/index.html` directly in a browser to preview. Changes are visible on refresh with no compilation needed.

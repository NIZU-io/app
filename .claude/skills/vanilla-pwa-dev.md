---
name: vanilla-pwa-dev
description: >
  Expert vanilla JS frontend developer specializing in offline-first PWAs using jQuery, Tailwind CSS (macOS-style design), LocalStorage, and IndexedDB. Use this skill whenever the user asks to build a webpage, UI component, dashboard, form, app, or any frontend interface. Also trigger when the user mentions LocalStorage, IndexedDB, PWA, offline app, SQL Server sync, service worker, manifest, or any data persistence topic. Always use this skill for any HTML/CSS/JS task — even if the request sounds simple. This skill enforces a strict file-split architecture (app.js, db.js, ui.js, etc.) and produces production-ready, installable PWA output every time.
---

# Vanilla PWA Developer Skill

You are an expert frontend developer. Every project you produce is a **fully offline-capable PWA** using:

- **Vanilla JS + jQuery** for all DOM manipulation and logic
- **Tailwind CSS** (CDN) with a **macOS-inspired design language**
- **LocalStorage** for preferences, app state, and schema versioning
- **IndexedDB** for synced remote SQL Server table data (via a sync layer)
- **IIFE + ES6+** module-style patterns (no bundler, no framework)
- **Separate files** per concern — never inline everything into one HTML file
- **i18n files** Languanges files will be stored in the locales folder, instead of using harcoded labels in the interface we will use variables that can be translated quickly using i18n JSON files

---

## File Structure (always follow this)

```
platforms/desktop/app/
├── index.html          # Shell only — no logic, no inline JS
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (cache-first strategy)
├── assets/
│   ├── css/
│   │   ├── app.css         # Tailwind directives + custom macOS vars
│   │   ├── all.min.css     # FontAwesome 7.0 Custom with our own logos
│   │   ├── nizu_init.css   # Base NIZU Desktop App CSS that will never change
│   │   └── nizu.css        # Customisations 
│   ├── scss/
│   │   └── fontawesome.scss# FontAwesome 7.0 SCSS
│   ├── js/
│   │   ├── app.js          # Boot, init, routing, app lifecycle
│   │   ├── db.js           # IndexedDB layer (remote SQL sync tables)
│   │   ├── store.js        # LocalStorage layer (prefs, versioning, state)
│   │   ├── ui.js           # DOM rendering, components, jQuery interactions
│   │   ├── sync.js         # Remote fetch/sync logic (SQL Server → IndexedDB)
│   │   └── utils.js        # Shared helpers, formatters, constants
│   └── images/             # Images Libraries
│       ├── icons           # PWA Icons
│       ├── logos           # Logos
│       ├── products        # Products
│       ├── services        # Services
│       ├── apps            # Apps Images
│       ├── avatars         # Avatars Images
│       ├── emojis          # Emojis
│       └── ui              # UI SVG Elements
└── locales/                # Locales i18 JSON format, a json file per language

```

Add more JS files as needed (e.g. `auth.js`, `router.js`, `charts.js`). Every file follows the IIFE pattern.

---

## Design System — macOS Style

### Color tokens (CSS vars in `app.css`)

```css
:root {
  color-scheme: light dark;

  /* Light */
  --bg-primary: #f5f5f7;
  --bg-secondary: #ffffff;
  --bg-tertiary: #e8e8ed;
  --surface: rgba(255,255,255,0.72);
  --surface-hover: rgba(0,0,0,0.04);
  --border: rgba(0,0,0,0.1);
  --text-primary: #1d1d1f;
  --text-secondary: #6e6e73;
  --text-tertiary: #aeaeb2;
  --accent: #0071e3;
  --accent-hover: #0077ed;
  --accent-text: #ffffff;
  --destructive: #ff3b30;
  --success: #34c759;
  --warning: #ff9f0a;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.12);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.16);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --blur: blur(20px) saturate(180%);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1c1c1e;
    --bg-secondary: #2c2c2e;
    --bg-tertiary: #3a3a3c;
    --surface: rgba(44,44,46,0.72);
    --surface-hover: rgba(255,255,255,0.06);
    --border: rgba(255,255,255,0.1);
    --text-primary: #f5f5f7;
    --text-secondary: #98989d;
    --text-tertiary: #636366;
    --accent: #2997ff;
    --accent-hover: #409cff;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.4);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
  }
}
```

### Key UI Patterns

**Cards / surfaces** — frosted glass effect

```html
<div class="card">...</div>
```

```css
.card {
  background: var(--surface);
  backdrop-filter: var(--blur);
  -webkit-backdrop-filter: var(--blur);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

**Buttons**

```html
<!-- Primary -->
<button class="btn-primary">Save</button>
<!-- Secondary -->
<button class="btn-secondary">Cancel</button>
<!-- Destructive -->
<button class="btn-destructive">Delete</button>
```

```css
.btn-primary {
  background: var(--accent);
  color: var(--accent-text);
  border-radius: var(--radius-sm);
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
}
.btn-primary:hover { background: var(--accent-hover); }
.btn-secondary {
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
  /* same padding/radius */
}
```

**Inputs**

```css
input, select, textarea {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  padding: 6px 10px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
}
input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,113,227,0.2); }
```

**Sidebar navigation** (macOS Finder/Settings style)

```html
<nav id="sidebar" class="sidebar">
  <ul>
    <li class="nav-item active" data-view="dashboard">
      <span class="nav-icon">⊞</span> Dashboard
    </li>
  </ul>
</nav>
```

**Typography** — use SF Pro-like stack:

```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
```

**Toasts / Notifications**

```js
// ui.js — always use this pattern
UI.toast('Saved successfully', 'success'); // success | warning | error | info
```

**Modals** — slide-up sheet style (macOS)

```html
<div id="modal-overlay" class="modal-overlay hidden">
  <div class="modal-sheet">
    <div class="modal-handle"></div>
    <div class="modal-body" id="modal-body"></div>
  </div>
</div>
```

---

## JavaScript Patterns

### IIFE Module Pattern (all JS files)

```js
// js/store.js
const Store = (function () {
  'use strict';

  const PREFIX = 'app_';
  const SCHEMA_VERSION = '1.0.0';

  function init() {
    if (!get('schema_version')) {
      set('schema_version', SCHEMA_VERSION);
      set('theme', 'system');
      set('user_prefs', {});
    }
    _migrateIfNeeded();
  }

  function set(key, value) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  }

  function get(key) {
    const raw = localStorage.getItem(PREFIX + key);
    try { return raw ? JSON.parse(raw) : null; } catch { return raw; }
  }

  function remove(key) {
    localStorage.removeItem(PREFIX + key);
  }

  function _migrateIfNeeded() {
    const stored = get('schema_version');
    if (stored !== SCHEMA_VERSION) {
      // run migrations here
      set('schema_version', SCHEMA_VERSION);
    }
  }

  return { init, set, get, remove };
})();
```

### IndexedDB Layer (db.js)

```js
// js/db.js — only for SQL Server synced tables
const DB = (function () {
  'use strict';

  const DB_NAME = 'app_db';
  const DB_VERSION = 1;
  let _db = null;

  // Define your SQL Server table mirrors here
  const STORES = [
    { name: 'customers',   keyPath: 'id' },
    { name: 'products',    keyPath: 'id' },
    { name: 'orders',      keyPath: 'id' },
  ];

  function open() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        STORES.forEach(s => {
          if (!db.objectStoreNames.contains(s.name)) {
            const store = db.createObjectStore(s.name, { keyPath: s.keyPath });
            // Add indexes as needed per table
            store.createIndex('_synced_at', '_synced_at', { unique: false });
          }
        });
      };
      req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
      req.onerror = (e) => reject(e.target.error);
    });
  }

  function getAll(storeName) {
    return new Promise((resolve, reject) => {
      const tx = _db.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function upsertMany(storeName, rows) {
    return new Promise((resolve, reject) => {
      const tx = _db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      rows.forEach(row => store.put({ ...row, _synced_at: Date.now() }));
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }

  function clearAndReplace(storeName, rows) {
    return new Promise((resolve, reject) => {
      const tx = _db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.clear();
      rows.forEach(row => store.put({ ...row, _synced_at: Date.now() }));
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }

  return { open, getAll, upsertMany, clearAndReplace };
})();
```

### Sync Layer (sync.js)

```js
// js/sync.js — fetch from SQL Server API, write to IndexedDB
const Sync = (function () {
  'use strict';

  const API_BASE = Store.get('api_base') || 'https://your-api.example.com';
  const SYNC_KEY = 'last_sync_';

  async function syncTable(tableName, endpoint) {
    const lastSync = Store.get(SYNC_KEY + tableName);
    const url = lastSync
      ? `${API_BASE}/${endpoint}?since=${lastSync}`
      : `${API_BASE}/${endpoint}`;

    try {
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${Store.get('auth_token')}` }
      });
      if (!res.ok) throw new Error(`Sync failed: ${res.status}`);
      const rows = await res.json();
      await DB.upsertMany(tableName, rows);
      Store.set(SYNC_KEY + tableName, new Date().toISOString());
      return { success: true, count: rows.length };
    } catch (err) {
      console.error(`[Sync] ${tableName}:`, err);
      return { success: false, error: err.message };
    }
  }

  async function syncAll() {
    UI.toast('Syncing...', 'info');
    const results = await Promise.allSettled([
      syncTable('customers', 'api/customers'),
      syncTable('products',  'api/products'),
      syncTable('orders',    'api/orders'),
    ]);
    const failed = results.filter(r => r.value?.success === false);
    if (failed.length === 0) UI.toast('Sync complete', 'success');
    else UI.toast(`Sync completed with ${failed.length} error(s)`, 'warning');
  }

  return { syncTable, syncAll };
})();
```

### App Boot (app.js)

```js
// js/app.js
const App = (function () {
  'use strict';

  async function init() {
    Store.init();
    await DB.open();
    UI.init();
    Router.init();
    _registerSW();
  }

  function _registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('[SW] Registered', reg.scope))
        .catch(err => console.warn('[SW] Failed', err));
    }
  }

  $(document).ready(() => init());

  return { init };
})();
```

---

## LocalStorage Conventions

| Key (with prefix) | Type | Purpose |
|---|---|---|
| `app_schema_version` | string | Current schema version for migrations |
| `app_theme` | `'system'` | Always `system` — never override |
| `app_user_prefs` | object | User-specific UI preferences |
| `app_auth_token` | string | Bearer token for API calls |
| `app_api_base` | string | Remote API base URL |
| `app_last_sync_<table>` | ISO string | Last successful sync timestamp per table |
| `app_<feature>_state` | object | Persisted UI state per feature |

**Rules:**

- Always prefix keys with `app_` via `Store.set/get`
- Never store sensitive PII in LocalStorage
- Theme is ALWAYS `system` — use `prefers-color-scheme` media query, never a manual toggle unless the user explicitly requests one
- Schema migrations run on every `Store.init()` call

---

## PWA Files

### manifest.json

```json
{
  "name": "App Name",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1c1c1e",
  "theme_color": "#1c1c1e",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### sw.js — Cache-first strategy

```js
const CACHE = 'app-v1';
const ASSETS = ['/', '/index.html', '/css/app.css',
  '/js/app.js', '/js/db.js', '/js/store.js',
  '/js/ui.js', '/js/sync.js', '/js/utils.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      });
    })
  );
});
```

---

## index.html Shell Pattern

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#1c1c1e" media="(prefers-color-scheme: dark)">
  <meta name="theme-color" content="#f5f5f7" media="(prefers-color-scheme: light)">
  <title>App Name</title>
  <link rel="manifest" href="manifest.json">
  <link rel="stylesheet" href="css/app.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</head>
<body>
  <!-- App shell — populated by ui.js -->
  <div id="app">
    <nav id="sidebar"></nav>
    <main id="main-content"></main>
  </div>
  <div id="toast-container"></div>
  <div id="modal-overlay" class="modal-overlay hidden"></div>

  <!-- Load order matters -->
  <script src="js/utils.js"></script>
  <script src="js/store.js"></script>
  <script src="js/db.js"></script>
  <script src="js/sync.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/router.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

---

## Output Checklist

Before delivering any code, verify:

- [ ] All JS files use IIFE pattern with `'use strict'`
- [ ] jQuery used for all DOM manipulation (no `document.querySelector` in ui.js)
- [ ] Theme is `system` only — CSS vars + `prefers-color-scheme`
- [ ] LocalStorage only for prefs, state, versioning (via `Store`)
- [ ] IndexedDB only for SQL Server mirrored tables (via `DB`)
- [ ] `sw.js` and `manifest.json` always included
- [ ] Tailwind CDN + custom CSS vars coexist (Tailwind for layout/spacing, CSS vars for color tokens)
- [ ] File split respected — no logic in `index.html`
- [ ] `sync.js` handles delta sync (uses `?since=` param when last_sync exists)
- [ ] All async operations have error handling and UI feedback via `UI.toast()`

---

## Reference Files

- `references/ui-patterns.md` — Full component library (tables, modals, sidebars, toasts, forms)
- `references/indexeddb-patterns.md` — Advanced IndexedDB queries, indexes, cursors
- `references/sync-patterns.md` — SQL Server sync strategies (delta, full, conflict resolution)

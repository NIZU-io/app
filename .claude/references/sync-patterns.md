# SQL Server Sync Patterns Reference

## Sync Architecture

```
SQL Server DB
    ↓  REST API (your backend)
  sync.js (fetch + transform)
    ↓
  IndexedDB (local mirror)
    ↓
  db.js (query layer)
    ↓
  ui.js (render)
```

The app never writes back to SQL Server from the frontend directly — that goes through the REST API, not the sync layer.

---

## Delta Sync (default — most efficient)

Use when your API supports a `since` parameter (ISO timestamp or row version).

```js
async function syncTable(tableName, endpoint) {
  const lastSync = Store.get('last_sync_' + tableName);
  const params = lastSync ? `?since=${encodeURIComponent(lastSync)}` : '';
  const url = `${API_BASE}/${endpoint}${params}`;

  const res = await fetch(url, { headers: _authHeaders() });
  if (!res.ok) throw new Error(res.status);

  const { data, deleted_ids } = await res.json();
  // Upsert new/changed rows
  if (data?.length)        await DB.upsertMany(tableName, data);
  // Remove deleted rows
  if (deleted_ids?.length) await DB.deleteByIds(tableName, deleted_ids);

  Store.set('last_sync_' + tableName, new Date().toISOString());
}
```

Expected API response shape:

```json
{
  "data": [ { "id": 1, "name": "...", "updated_at": "..." } ],
  "deleted_ids": [42, 99]
}
```

---

## Full Replace Sync (simpler, for small tables)

Use for lookup/reference tables (e.g., categories, statuses, config).

```js
async function syncFull(tableName, endpoint) {
  const res = await fetch(`${API_BASE}/${endpoint}`, { headers: _authHeaders() });
  if (!res.ok) throw new Error(res.status);
  const rows = await res.json();
  await DB.clearAndReplace(tableName, rows);
  Store.set('last_sync_' + tableName, new Date().toISOString());
}
```

---

## Sync Config Table

Define all your tables in one place in `sync.js`:

```js
const SYNC_TABLES = [
  { store: 'customers', endpoint: 'api/customers', strategy: 'delta' },
  { store: 'products',  endpoint: 'api/products',  strategy: 'delta' },
  { store: 'orders',    endpoint: 'api/orders',     strategy: 'delta' },
  { store: 'statuses',  endpoint: 'api/statuses',   strategy: 'full'  },
  { store: 'regions',   endpoint: 'api/regions',    strategy: 'full'  },
];

async function syncAll() {
  const results = [];
  for (const t of SYNC_TABLES) {
    try {
      if (t.strategy === 'full') await syncFull(t.store, t.endpoint);
      else                       await syncTable(t.store, t.endpoint);
      results.push({ store: t.store, success: true });
    } catch (err) {
      console.error(`[Sync] ${t.store}:`, err);
      results.push({ store: t.store, success: false, error: err.message });
    }
  }
  return results;
}
```

---

## Auth Headers Helper

```js
function _authHeaders() {
  const token = Store.get('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}
```

---

## Sync Status UI Pattern

Show per-table sync status in the sidebar footer:

```js
async function syncAllWithUI() {
  $('#btn-sync').prop('disabled', true).text('⟳ Syncing...');
  const results = await Sync.syncAll();
  const failed = results.filter(r => !r.success);

  if (failed.length === 0) {
    UI.toast('All tables synced', 'success');
  } else {
    const names = failed.map(r => r.store).join(', ');
    UI.toast(`Sync failed: ${names}`, 'error');
  }

  $('#btn-sync').prop('disabled', false).text('⟳ Sync Now');
  _updateSyncTimestamp();
}

function _updateSyncTimestamp() {
  const times = SYNC_TABLES.map(t => Store.get('last_sync_' + t.store)).filter(Boolean);
  if (!times.length) return;
  const latest = new Date(Math.max(...times.map(t => new Date(t))));
  $('#sync-timestamp').text('Last sync: ' + Utils.formatRelativeTime(latest));
}
```

---

## Conflict Resolution (optimistic — server wins)

Since this is a read-mirror architecture, server always wins:

- On delta sync, server rows overwrite local via `upsertMany` (PUT semantics)
- Deleted server rows are removed locally via `deleteByIds`
- Local data is never sent back to the server through the sync layer

If you need write-back, implement it as a separate API call in a `mutations.js` file, not in `sync.js`.

---

## Offline Detection & Retry

```js
// In app.js
$(window).on('online',  () => { UI.toast('Back online — syncing', 'info'); Sync.syncAll(); });
$(window).on('offline', () => { UI.toast('Offline — using local data', 'warning'); });

// Check on boot
if (!navigator.onLine) {
  UI.toast('Offline mode', 'warning');
} else {
  Sync.syncAll();
}
```

---

## Pagination for Large Tables

If the SQL Server table has millions of rows, sync in pages:

```js
async function syncTablePaged(tableName, endpoint, pageSize = 1000) {
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(
      `${API_BASE}/${endpoint}?page=${page}&size=${pageSize}`,
      { headers: _authHeaders() }
    );
    const { data, has_more } = await res.json();
    await DB.upsertChunked(tableName, data);
    hasMore = has_more;
    page++;
    UI.toast(`Syncing ${tableName}: page ${page}`, 'info');
  }

  Store.set('last_sync_' + tableName, new Date().toISOString());
}
```

# IndexedDB Patterns Reference

## Philosophy

IndexedDB in this stack is a **read-optimized local mirror** of SQL Server tables.

- You never write business data to IndexedDB directly — only via `sync.js`
- All writes stamp `_synced_at` (epoch ms) for audit/debug
- Schema version is managed by `DB_VERSION` integer — bump it when adding stores/indexes

---

## Opening with Multiple Object Stores

```js
const STORES = [
  {
    name: 'customers',
    keyPath: 'id',
    indexes: [
      { name: 'by_email', keyPath: 'email', unique: true },
      { name: 'by_status', keyPath: 'status', unique: false },
    ]
  },
  {
    name: 'orders',
    keyPath: 'id',
    indexes: [
      { name: 'by_customer', keyPath: 'customer_id', unique: false },
      { name: 'by_date', keyPath: 'order_date', unique: false },
    ]
  },
];

req.onupgradeneeded = (e) => {
  const db = e.target.result;
  STORES.forEach(s => {
    let store;
    if (!db.objectStoreNames.contains(s.name)) {
      store = db.createObjectStore(s.name, { keyPath: s.keyPath });
    } else {
      store = e.target.transaction.objectStore(s.name);
    }
    (s.indexes || []).forEach(idx => {
      if (!store.indexNames.contains(idx.name)) {
        store.createIndex(idx.name, idx.keyPath, { unique: idx.unique });
      }
    });
  });
};
```

---

## Query Patterns

### Get by primary key

```js
function getById(storeName, id) {
  return new Promise((resolve, reject) => {
    const tx = _db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}
```

### Get by index (single value)

```js
function getByIndex(storeName, indexName, value) {
  return new Promise((resolve, reject) => {
    const tx = _db.transaction(storeName, 'readonly');
    const index = tx.objectStore(storeName).index(indexName);
    const req = index.getAll(value);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
// Usage: DB.getByIndex('orders', 'by_customer', customerId)
```

### Range query (date range, numeric range)

```js
function getByRange(storeName, indexName, lower, upper) {
  return new Promise((resolve, reject) => {
    const tx = _db.transaction(storeName, 'readonly');
    const range = IDBKeyRange.bound(lower, upper);
    const req = tx.objectStore(storeName).index(indexName).getAll(range);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
// Usage: DB.getByRange('orders', 'by_date', '2024-01-01', '2024-12-31')
```

### Cursor (large datasets, filtering in JS)

```js
function getCursor(storeName, filterFn) {
  return new Promise((resolve, reject) => {
    const results = [];
    const tx = _db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).openCursor();
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        if (!filterFn || filterFn(cursor.value)) results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    req.onerror = () => reject(req.error);
  });
}
// Usage: DB.getCursor('customers', row => row.status === 'active')
```

### Count records

```js
function count(storeName, indexName, value) {
  return new Promise((resolve, reject) => {
    const tx = _db.transaction(storeName, 'readonly');
    const target = indexName
      ? tx.objectStore(storeName).index(indexName)
      : tx.objectStore(storeName);
    const req = value !== undefined ? target.count(value) : target.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
```

---

## Handling DB_VERSION Upgrades

When you add a new store or index, bump `DB_VERSION`. The `onupgradeneeded` handler fires with the old and new version:

```js
req.onupgradeneeded = (e) => {
  const db = e.target.result;
  const oldVersion = e.oldVersion;

  if (oldVersion < 1) {
    // Initial schema
    db.createObjectStore('customers', { keyPath: 'id' });
  }
  if (oldVersion < 2) {
    // Migration: add products store
    db.createObjectStore('products', { keyPath: 'id' });
  }
  if (oldVersion < 3) {
    // Migration: add index to existing store
    const store = e.target.transaction.objectStore('customers');
    store.createIndex('by_region', 'region', { unique: false });
  }
};
```

---

## Bulk Operations

### Chunked upsert (large payloads, avoids UI blocking)

```js
async function upsertChunked(storeName, rows, chunkSize = 500) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    await upsertMany(storeName, chunk);
    // Yield to UI thread
    await new Promise(r => setTimeout(r, 0));
  }
}
```

### Delete stale records (cleanup after full sync)

```js
function deleteByIds(storeName, ids) {
  return new Promise((resolve, reject) => {
    const tx = _db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    ids.forEach(id => store.delete(id));
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}
```

---

## Exposing a Simple Query API from db.js

Add these to the `return` statement of the DB IIFE:

```js
return {
  open,
  getAll,
  getById,
  getByIndex,
  getByRange,
  getCursor,
  count,
  upsertMany,
  upsertChunked,
  clearAndReplace,
  deleteByIds,
};
```

# UI Patterns Reference

## Toast Notifications (ui.js)

```js
const UI = (function () {
  function toast(message, type = 'info', duration = 3000) {
    const colors = {
      success: 'var(--success)',
      error:   'var(--destructive)',
      warning: 'var(--warning)',
      info:    'var(--accent)'
    };
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    const $t = $(`
      <div class="toast" style="border-left: 3px solid ${colors[type]}">
        <span class="toast-icon">${icons[type]}</span>
        <span>${message}</span>
      </div>
    `).appendTo('#toast-container').hide().fadeIn(200);
    setTimeout(() => $t.fadeOut(300, () => $t.remove()), duration);
  }
  return { toast };
})();
```

```css
#toast-container {
  position: fixed; bottom: 24px; right: 24px;
  display: flex; flex-direction: column; gap: 8px; z-index: 9999;
}
.toast {
  background: var(--surface);
  backdrop-filter: var(--blur);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px 16px;
  box-shadow: var(--shadow-lg);
  color: var(--text-primary);
  font-size: 13px;
  display: flex; align-items: center; gap: 8px;
  min-width: 240px; max-width: 360px;
}
```

---

## Modal Sheet (macOS style)

```js
// ui.js
function openModal(title, bodyHtml, actions = []) {
  const actionsHtml = actions.map(a =>
    `<button class="btn-${a.type || 'secondary'}" data-action="${a.id}">${a.label}</button>`
  ).join('');

  $('#modal-body').html(`
    <div class="modal-header">
      <h2 class="modal-title">${title}</h2>
    </div>
    <div class="modal-content">${bodyHtml}</div>
    <div class="modal-footer">${actionsHtml}</div>
  `);

  $('#modal-overlay').removeClass('hidden');
  $('body').addClass('modal-open');

  // Wire actions
  actions.forEach(a => {
    $(`[data-action="${a.id}"]`).on('click', () => {
      if (a.handler) a.handler();
      if (a.close !== false) closeModal();
    });
  });
}

function closeModal() {
  $('#modal-overlay').addClass('hidden');
  $('body').removeClass('modal-open');
}

// Close on overlay click
$('#modal-overlay').on('click', function (e) {
  if ($(e.target).is('#modal-overlay')) closeModal();
});
```

```css
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  display: flex; align-items: flex-end; justify-content: center;
  z-index: 1000;
}
.modal-overlay.hidden { display: none; }
.modal-sheet {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  width: 100%; max-width: 640px;
  padding: 24px;
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.25s ease;
}
.modal-handle {
  width: 36px; height: 4px;
  background: var(--text-tertiary);
  border-radius: 2px;
  margin: 0 auto 20px;
}
.modal-title { font-size: 17px; font-weight: 600; color: var(--text-primary); }
.modal-footer { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
```

---

## Sidebar Navigation

```html
<nav id="sidebar">
  <div class="sidebar-header">
    <img src="icons/icon-192.png" class="sidebar-logo" alt="Logo">
    <span class="sidebar-title">App Name</span>
  </div>
  <ul class="sidebar-nav">
    <li class="nav-group-label">Main</li>
    <li class="nav-item active" data-view="dashboard">
      <svg class="nav-icon"><!-- icon --></svg>
      <span>Dashboard</span>
    </li>
    <li class="nav-item" data-view="data">
      <svg class="nav-icon"><!-- icon --></svg>
      <span>Data</span>
    </li>
  </ul>
  <div class="sidebar-footer">
    <button id="btn-sync" class="btn-secondary w-full">⟳ Sync Now</button>
  </div>
</nav>
```

```css
#sidebar {
  width: 220px; min-height: 100vh;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  padding: 16px 8px;
  user-select: none;
}
.sidebar-header { display: flex; align-items: center; gap: 10px; padding: 0 8px 16px; }
.sidebar-logo { width: 28px; height: 28px; border-radius: var(--radius-sm); }
.sidebar-title { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.nav-group-label {
  font-size: 11px; font-weight: 600; color: var(--text-tertiary);
  text-transform: uppercase; letter-spacing: 0.05em;
  padding: 8px 10px 4px; list-style: none;
}
.nav-item {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px; border-radius: var(--radius-sm);
  cursor: pointer; color: var(--text-secondary);
  font-size: 13px; font-weight: 500;
  transition: background 0.1s, color 0.1s;
  list-style: none;
}
.nav-item:hover { background: var(--surface-hover); color: var(--text-primary); }
.nav-item.active {
  background: var(--accent);
  color: #fff;
}
.sidebar-footer { margin-top: auto; padding-top: 16px; }
```

---

## Data Table (jQuery powered)

```js
// ui.js
function renderTable(containerId, columns, rows, opts = {}) {
  const headers = columns.map(c => `<th>${c.label}</th>`).join('');
  const bodyRows = rows.map(row => {
    const cells = columns.map(c => {
      const val = row[c.key] ?? '';
      return `<td>${c.render ? c.render(val, row) : val}</td>`;
    }).join('');
    return `<tr data-id="${row.id}">${cells}</tr>`;
  }).join('');

  $(`#${containerId}`).html(`
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr>${headers}</tr></thead>
        <tbody>${bodyRows || '<tr><td colspan="${columns.length}" class="empty">No data</td></tr>'}</tbody>
      </table>
    </div>
  `);

  if (opts.onRowClick) {
    $(`#${containerId} tbody tr`).on('click', function () {
      const id = $(this).data('id');
      const row = rows.find(r => String(r.id) === String(id));
      opts.onRowClick(row);
    });
  }
}
```

```css
.table-wrap { overflow-x: auto; border-radius: var(--radius-md); border: 1px solid var(--border); }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table thead { background: var(--bg-tertiary); }
.data-table th {
  padding: 8px 12px; text-align: left;
  color: var(--text-secondary); font-weight: 600;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
.data-table td {
  padding: 9px 12px; color: var(--text-primary);
  border-bottom: 1px solid var(--border);
}
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover { background: var(--surface-hover); cursor: pointer; }
```

---

## Form Pattern

```html
<form id="my-form" class="form-card">
  <div class="form-group">
    <label class="form-label" for="name">Full Name</label>
    <input type="text" id="name" name="name" class="form-input" placeholder="John Doe">
    <span class="form-error" id="err-name"></span>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label class="form-label">Email</label>
      <input type="email" id="email" name="email" class="form-input">
    </div>
    <div class="form-group">
      <label class="form-label">Role</label>
      <select id="role" name="role" class="form-input">
        <option value="">Select...</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  </div>
  <div class="form-actions">
    <button type="button" class="btn-secondary" id="btn-cancel">Cancel</button>
    <button type="submit" class="btn-primary">Save</button>
  </div>
</form>
```

```js
// jQuery form handling
$('#my-form').on('submit', function (e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(this));
  if (!data.name) { $('#err-name').text('Required'); return; }
  // process data...
});
```

```css
.form-card { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; }
.form-group { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-label { font-size: 12px; font-weight: 500; color: var(--text-secondary); }
.form-input { /* inherits from global input styles */ }
.form-error { font-size: 11px; color: var(--destructive); }
.form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border); }
```

---

## Loading / Skeleton States

```js
// ui.js
function showSkeleton(containerId, rows = 5) {
  const skeletons = Array(rows).fill(`
    <div class="skeleton-row">
      <div class="skeleton" style="width:40%"></div>
      <div class="skeleton" style="width:25%"></div>
      <div class="skeleton" style="width:20%"></div>
    </div>
  `).join('');
  $(`#${containerId}`).html(`<div class="skeleton-wrap">${skeletons}</div>`);
}
```

```css
.skeleton {
  height: 14px; border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--surface-hover) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.skeleton-row { display: flex; gap: 16px; padding: 10px 12px; border-bottom: 1px solid var(--border); }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
```

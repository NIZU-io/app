const UI = {

    // ── Webview pool ───────────────────────────────────────────
    // Keyed by workspace id → <iframe> element.
    // Frames are never destroyed while the workspace exists so the
    // page keeps running in the background when the user switches.
    _pool: {},

    _getPool() {
        let pool = document.getElementById('webview-pool');
        if (!pool) {
            pool = document.createElement('div');
            pool.id = 'webview-pool';
            document.getElementById('app').appendChild(pool);
        }
        return pool;
    },

    activateWebview(ws) {
        const pool = this._getPool();

        // Lazily create the iframe on first visit
        if (!this._pool[ws.id]) {
            const iframe = document.createElement('iframe');
            iframe.className = 'ws-frame';
            iframe.src = ws.url;
            iframe.allow = 'fullscreen; camera; microphone; payment; clipboard-read; clipboard-write';
            iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
            pool.appendChild(iframe);
            this._pool[ws.id] = iframe;
        }

        // Deactivate every frame, then activate the requested one
        Object.values(this._pool).forEach(f => f.classList.remove('ws-frame--active'));
        this._pool[ws.id].classList.add('ws-frame--active');

        // Bring pool above main-content
        pool.classList.add('pool--visible');
    },

    removeFromPool(id) {
        if (this._pool[id]) {
            this._pool[id].remove();
            delete this._pool[id];
        }
        // If pool is now empty, hide it
        if (!Object.keys(this._pool).length) {
            const pool = document.getElementById('webview-pool');
            if (pool) pool.classList.remove('pool--visible');
        }
    },

    refreshActiveFrame() {
        const id = Store.activeId();
        if (id && this._pool[id]) {
            this._pool[id].src = this._pool[id].src;
        }
    },

    _hidePool() {
        const pool = document.getElementById('webview-pool');
        if (!pool) return;
        pool.classList.remove('pool--visible');
        Object.values(this._pool).forEach(f => f.classList.remove('ws-frame--active'));
    },

    // ── Sidebar ────────────────────────────────────────────────
    renderSidebar() {
        const workspaces = Store.all();
        const activeId = Store.activeId();
        const $sidebar = $('#sidebar');
        $sidebar.empty();

        const $list = $('<div class="ws-list"></div>');
        workspaces.forEach(ws => {
            const isActive = ws.id === activeId;
            const $icon = $('<button></button>')
                .addClass('ws-icon' + (isActive ? ' ws-icon--active' : ''))
                .attr({ 'data-id': ws.id, title: ws.name })
                .css({
                    backgroundColor: ws.color,
                    outlineColor: isActive ? ws.color : 'transparent'
                })
                .text(Utils.getInitial(ws.name));
            $list.append($icon);
        });

        const $footer = $('<div class="nav-footer"></div>');
        const $addBtn = $('<button id="btn-add-ws"></button>')
            .attr('title', i18next.t('values.addWorkspace'))
            .html('<i class="fas fa-plus"></i>');
        $footer.append($addBtn);

        $sidebar.append($list).append($footer);
    },

    // ── Views ──────────────────────────────────────────────────
    renderEmpty() {
        this._hidePool();
        $('#main-content').html(
            '<div class="empty-state">' +
            '<button class="ws-action-btn" id="btn-join-ws">' + i18next.t('values.joinWorkspace') + '</button>' +
            '<button class="ws-action-btn" id="btn-create-ws">' + i18next.t('values.createWorkspace') + '</button>' +
            '</div>'
        );
    },

    renderJoinForm() {
        this._hidePool();
        $('#main-content').html(
            '<div class="join-form">' +
            '<input type="text" id="input-ws-url" class="join-input" placeholder="myworkspace.nizu.io" autocomplete="off" spellcheck="false">' +
            '<button class="ws-primary-btn" id="btn-join-submit">' + i18next.t('values.join') + '</button>' +
            '</div>'
        );
        setTimeout(() => $('#input-ws-url').focus(), 50);
    },

    // ── Context menu ───────────────────────────────────────────
    showContextMenu(x, y, workspaceId) {
        this.hideContextMenu();
        const $menu = $('<div class="context-menu" id="context-menu"></div>');

        const items = [
            { action: 'delete',  label: i18next.t('values.deleteWorkspace'), danger: true  },
            { action: 'refresh', label: i18next.t('values.refreshWindow'),   danger: false },
            { action: 'logout',  label: i18next.t('values.logout'),          danger: false }
        ];

        items.forEach(item => {
            $('<button class="ctx-item"></button>')
                .addClass(item.danger ? 'ctx-item--danger' : '')
                .attr({ 'data-action': item.action, 'data-id': workspaceId })
                .text(item.label)
                .appendTo($menu);
        });

        const menuW = 176, menuH = items.length * 36;
        const left = (x + menuW > window.innerWidth)  ? x - menuW : x;
        const top  = (y + menuH > window.innerHeight) ? y - menuH : y;
        $menu.css({ top, left });
        $('body').append($menu);
    },

    hideContextMenu() {
        $('#context-menu').remove();
    },

    // ── Modal ──────────────────────────────────────────────────
    showOnboardingModal() {
        const url = 'https://onboarding.nizu.io/' + Utils.getLangCode() + '?source=app';
        $('#modal-body').html(
            '<div class="onboarding-modal">' +
            '<button class="modal-close-btn" id="btn-modal-close"><i class="fas fa-times"></i></button>' +
            '<iframe src="' + url + '" class="onboarding-iframe"' +
            ' allow="fullscreen; camera; microphone; payment; clipboard-read; clipboard-write"></iframe>' +
            '</div>'
        );
        $('#modal-overlay').removeClass('hidden');
    },

    hideModal() {
        $('#modal-overlay').addClass('hidden');
        $('#modal-body').empty();
    }
};

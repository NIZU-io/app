$(function () {
    Utils.applyOSClass();

    fetch('locales/en.json')
        .then(r => r.json())
        .then(data => {
            i18next.init({
                lng: Utils.getLangCode(),
                fallbackLng: 'en',
                resources: { en: { translation: data } }
            }, App.boot.bind(App));
        })
        .catch(App.boot.bind(App));
});

const App = {

    boot() {
        UI.renderSidebar();
        this._bindEvents();

        const workspaces = Store.all();
        const active = Store.get(Store.activeId()) || workspaces[0] || null;

        if (active) {
            Router.go('workspace', { id: active.id });
        } else {
            Router.go('empty');
        }
    },

    _bindEvents() {
        // Add workspace button
        $(document).on('click', '#btn-add-ws', function () {
            Router.go('join');
        });

        // Empty state — join existing
        $(document).on('click', '#btn-join-ws', function () {
            Router.go('join');
        });

        // Empty state — create own workspace → onboarding modal
        $(document).on('click', '#btn-create-ws', function () {
            UI.showOnboardingModal();
        });

        // Join form submit
        $(document).on('click', '#btn-join-submit', function () {
            App._handleJoin();
        });
        $(document).on('keydown', '#input-ws-url', function (e) {
            if (e.key === 'Enter') App._handleJoin();
        });

        // Switch workspace on icon click
        $(document).on('click', '.ws-icon', function (e) {
            e.stopPropagation();
            Router.go('workspace', { id: $(this).data('id') });
        });

        // Right-click on workspace icon → context menu
        $(document).on('contextmenu', '.ws-icon', function (e) {
            e.preventDefault();
            e.stopPropagation();
            UI.showContextMenu(e.clientX, e.clientY, $(this).data('id'));
        });

        // Context menu actions
        $(document).on('click', '.ctx-item', function () {
            const action = $(this).data('action');
            const id     = $(this).data('id');
            UI.hideContextMenu();
            if (action === 'delete')  App._deleteWorkspace(id);
            if (action === 'refresh') App._refreshWebview();
            if (action === 'logout')  App._logout(id);
        });

        // Close context menu on outside click
        $(document).on('click', function (e) {
            if (!$(e.target).closest('#context-menu').length) UI.hideContextMenu();
        });

        // Close modal
        $(document).on('click', '#btn-modal-close', function () {
            UI.hideModal();
        });
        $(document).on('click', '#modal-overlay', function (e) {
            if ($(e.target).is('#modal-overlay')) UI.hideModal();
        });
    },

    _handleJoin() {
        const raw = $('#input-ws-url').val().trim();
        if (!raw) return;
        const subdomain = Utils.normalizeHost(raw);
        if (!subdomain) return;
        const ws = Store.add(subdomain);
        UI.renderSidebar();
        Router.go('workspace', { id: ws.id });
    },

    _deleteWorkspace(id) {
        const ws = Store.get(id);
        if (ws) DB.clearWorkspaceData(ws.subdomain);
        Store.remove(id);
        UI.removeFromPool(id);
        const remaining = Store.all();
        UI.renderSidebar();
        if (remaining.length > 0) {
            Router.go('workspace', { id: remaining[0].id });
        } else {
            Router.go('empty');
        }
    },

    _refreshWebview() {
        UI.refreshActiveFrame();
    },

    _logout(id) {
        App._deleteWorkspace(id);
    }
};

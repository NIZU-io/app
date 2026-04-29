const Router = {
    current: null,

    go(view, params) {
        this.current = view;
        UI.hideContextMenu();

        if (view === 'empty') {
            UI.renderTitlebar(null);
            UI.renderEmpty();

        } else if (view === 'join') {
            UI.renderTitlebar(null);
            UI.renderJoinForm();

        } else if (view === 'workspace') {
            const ws = Store.get(params.id);
            if (!ws) { this.go('empty'); return; }
            Store.setActive(ws.id);
            UI.renderTitlebar(ws);
            UI.renderWebview(ws);
            UI.renderSidebar();
        }
    }
};

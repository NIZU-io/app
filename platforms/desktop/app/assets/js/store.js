const Store = {
    _WS_KEY: 'nizu_workspaces',
    _ACTIVE_KEY: 'nizu_active',

    all() {
        try { return JSON.parse(localStorage.getItem(this._WS_KEY) || '[]'); }
        catch { return []; }
    },

    add(host) {
        const list = this.all();
        const existing = list.find(ws => ws.subdomain === host);
        if (existing) return existing;

        const ws = {
            id: Utils.generateId(),
            name: Utils.capitalize(host.split('.')[0]),
            subdomain: host,
            url: Utils.toUrl(host),
            color: Utils.randomColor()
        };
        list.push(ws);
        localStorage.setItem(this._WS_KEY, JSON.stringify(list));
        return ws;
    },

    remove(id) {
        const list = this.all().filter(ws => ws.id !== id);
        localStorage.setItem(this._WS_KEY, JSON.stringify(list));
        if (this.activeId() === id) localStorage.removeItem(this._ACTIVE_KEY);
    },

    activeId() {
        return localStorage.getItem(this._ACTIVE_KEY);
    },

    setActive(id) {
        localStorage.setItem(this._ACTIVE_KEY, id);
    },

    get(id) {
        return this.all().find(ws => ws.id === id) || null;
    }
};

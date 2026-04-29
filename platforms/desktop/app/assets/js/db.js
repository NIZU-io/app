const DB = {
    clearWorkspaceData(subdomain) {
        if ('caches' in window) {
            caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
        }
        const prefix = 'nizu_ws_' + subdomain + '_';
        Object.keys(localStorage)
            .filter(k => k.startsWith(prefix))
            .forEach(k => localStorage.removeItem(k));
    }
};

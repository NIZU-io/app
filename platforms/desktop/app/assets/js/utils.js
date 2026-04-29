const Utils = {
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    getInitial(name) {
        return (name || '?').charAt(0).toUpperCase();
    },

    getLangCode() {
        return (navigator.language || 'en').split('-')[0];
    },

    randomColor() {
        const palette = ['#f6c90e', '#4a90d9', '#e06c75', '#56b6c2', '#98c379', '#d19a66', '#c678dd'];
        return palette[Math.floor(Math.random() * palette.length)];
    },

    normalizeSubdomain(input) {
        let s = input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
        if (s.endsWith('.nizu.io')) s = s.replace(/\.nizu\.io$/, '');
        return s;
    },

    subdomainToUrl(subdomain) {
        return 'https://' + subdomain + '.nizu.io/';
    },

    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};

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

    normalizeHost(input) {
        return input.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    },

    toUrl(host) {
        return 'https://' + host + '/';
    },

    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    detectOS() {
        const ua = navigator.userAgent;
        const p  = navigator.platform || '';
        if (/Mac/.test(p) || /Macintosh/.test(ua)) return 'macos';
        if (/Win/.test(p) || /Windows/.test(ua))   return 'windows';
        return 'linux';  /* Ubuntu and all other Linux */
    },

    applyOSClass() {
        const os = this.detectOS();
        document.documentElement.classList.add('os-' + os);
        return os;
    }
};

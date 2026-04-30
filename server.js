#!/usr/bin/env node
/**
 * Dev server — serves platforms/desktop/app/ at http://localhost:3000
 * No dependencies; uses Node built-ins only.
 */
const http = require('http');
const path = require('path');
const fs   = require('fs');

const ROOT = path.join(__dirname, 'platforms', 'desktop', 'app');
const PORT = process.env.PORT || 3000;

const MIME = {
    '.html':  'text/html; charset=utf-8',
    '.css':   'text/css; charset=utf-8',
    '.js':    'application/javascript; charset=utf-8',
    '.json':  'application/json; charset=utf-8',
    '.png':   'image/png',
    '.jpg':   'image/jpeg',
    '.jpeg':  'image/jpeg',
    '.svg':   'image/svg+xml',
    '.ico':   'image/x-icon',
    '.webp':  'image/webp',
    '.woff':  'font/woff',
    '.woff2': 'font/woff2',
    '.ttf':   'font/ttf',
    '.eot':   'application/vnd.ms-fontobject',
    '.webm':  'video/webm',
    '.mp4':   'video/mp4',
};

const server = http.createServer((req, res) => {
    // Strip query string and decode
    const urlPath = decodeURIComponent(req.url.split('?')[0]);

    // Resolve to a real file path, defaulting directory → index.html
    let filePath = path.join(ROOT, urlPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    // Prevent path traversal outside ROOT
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        return res.end('Forbidden');
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('404 Not Found: ' + urlPath);
        }

        const ext  = path.extname(filePath).toLowerCase();
        const mime = MIME[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type':  mime,
            'Cache-Control': 'no-store',
        });
        res.end(data);
    });
});

server.listen(PORT, '127.0.0.1', () => {
    const url = `http://localhost:${PORT}`;
    console.log(`\n  NIZU dev server`);
    console.log(`  ───────────────────────────────`);
    console.log(`  Local:   ${url}`);
    console.log(`  Root:    platforms/desktop/app/`);
    console.log(`  Press Ctrl+C to stop\n`);

    // Auto-open in default browser (best-effort)
    const open =
        process.platform === 'darwin' ? 'open' :
        process.platform === 'win32'  ? 'start' : 'xdg-open';
    require('child_process').exec(`${open} ${url}`);
});

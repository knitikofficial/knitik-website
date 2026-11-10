const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.bmp': 'image/bmp',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  // Legacy route 301 redirects
  if (reqPath === '/contact' || reqPath === '/contact.html') {
    res.writeHead(301, { 'Location': '/about#contact' });
    res.end();
    return;
  }
  if (reqPath === '/case-studies' || reqPath === '/case-studies.html') {
    res.writeHead(301, { 'Location': '/results' });
    res.end();
    return;
  }
  if (reqPath === '/terms' || reqPath === '/terms.html') {
    res.writeHead(301, { 'Location': '/terms-and-conditions' });
    res.end();
    return;
  }

  let filePath = path.join(__dirname, reqPath);

  fs.stat(filePath, (err, stats) => {
    let finalPath = filePath;
    let statusCode = 200;

    if (err || !stats.isFile()) {
      const htmlPath = filePath + '.html';
      if (fs.existsSync(htmlPath)) {
        finalPath = htmlPath;
      } else {
        const notFoundPath = path.join(__dirname, '404.html');
        if (fs.existsSync(notFoundPath)) {
          finalPath = notFoundPath;
          statusCode = 404;
        } else {
          res.writeHead(404, {
            'Content-Type': 'text/html; charset=UTF-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          });
          res.end('<h1>404 Not Found - KNITIK</h1>');
          return;
        }
      }
    }

    const ext = path.extname(finalPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(finalPath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(statusCode, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
        res.end(content);
      }
    });
  });
});

if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(`\n🚀 KNITIK Official Website is live and running at http://localhost:${PORT}`);
    console.log(`Domain: knitik.com | Founder: Sagar Burman (Light Theme Adymize Reference)\n`);
  });
}

module.exports = server;

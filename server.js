const http = require('http');
const fs = require('fs');
const path = require('path');

// Allow overriding the port, e.g. `npm start` after setting PORT=4000
const PORT = process.env.PORT || 3000;
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  // Strip query string / hash and decode (e.g. "/style.css?v=2" -> "/style.css")
  let urlPath = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  let filePath = path.join(__dirname, urlPath);
  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠  Port ${PORT} is already in use (another server is still running).`);
    console.error(`   • Stop it, or start on a different port:  set PORT=4000 && npm start`);
    console.error(`   • Windows: find it with  netstat -ano | findstr :${PORT}`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log(`Rebeca Islam site running at http://localhost:${PORT}`);
});

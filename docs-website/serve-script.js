const handler = require('serve-handler');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((request, response) => {
  // Rewrite /orm/* to /*
  if (request.url.startsWith('/orm')) {
    request.url = request.url.substring(4) || '/';
  }
  
  // Remove query parameters for file checking
  const urlWithoutQuery = request.url.split('?')[0];
  
  // If URL ends with /, serve index.html
  if (urlWithoutQuery.endsWith('/')) {
    request.url = urlWithoutQuery + 'index.html';
  }
  // If URL doesn't have an extension and is not a file, try to serve .html
  else if (!path.extname(urlWithoutQuery) && !urlWithoutQuery.includes('_next')) {
    const htmlPath = path.join(__dirname, 'out', urlWithoutQuery + '.html');
    if (fs.existsSync(htmlPath)) {
      request.url = urlWithoutQuery + '.html';
    }
  }
  
  return handler(request, response, {
    public: path.join(__dirname, 'out'),
    cleanUrls: false,
    trailingSlash: false,
    directoryListing: false
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`\n  Server running at http://localhost:${PORT}/orm\n`);
});

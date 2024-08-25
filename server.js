const { createServer } = require('node:http');
const hostname = '0.0.0.0'; // Listen on all available network interfaces
const port = 80; // Standard HTTP port

const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  
  switch(req.url) {
    case '/':
      res.statusCode = 200;
      res.end('Welcome to ew42.com');
      break;
    case '/about':
      res.statusCode = 200;
      res.end('About ew42.com');
      break;
    case '/contact':
      res.statusCode = 200;
      res.end('Contact Information for ew42.com');
      break;
    default:
      res.statusCode = 404;
      res.end('404 Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://ew42.com/`);
});

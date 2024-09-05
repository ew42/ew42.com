const { createServer } = require('node:http');
const fs = require('fs');
const path = require('path');

const hostname = '0.0.0.0';
const port = 80;

// Create a write stream for logging
const logStream = fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' });

// Function to log messages to both console and file
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  console.log(logMessage);
  logStream.write(logMessage);
}

const server = createServer((req, res) => {
  log(`Received request for ${req.url}`);
  
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

server.on('error', (error) => {
  log(`Server error: ${error.message}`);
});

server.listen(port, hostname, () => {
  log(`Server running at http://ew42.com/`);
});

process.on('uncaughtException', (error) => {
  log(`Uncaught Exception: ${error.message}`);
  log('Server will attempt to continue running.');
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  log('Server will attempt to continue running.');
});

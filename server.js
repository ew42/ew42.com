const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Update these paths to point to your certificate files
const certPath = '/etc/letsencrypt/live/ew42.com/fullchain.pem';
const keyPath = '/etc/letsencrypt/live/ew42.com/privkey.pem';

const options = {
  cert: fs.readFileSync(certPath),
  key: fs.readFileSync(keyPath)
};

const httpsPort = 443;
const httpPort = 80;

const logStream = fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' });

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  console.log(logMessage);
  logStream.write(logMessage);
}

const requestHandler = (req, res) => {
  const clientIp = req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  log(`HTTPS Request from ${clientIp} - ${userAgent} for ${req.url}`);
  
  res.setHeader('Content-Type', 'text/plain');
  
  switch(req.url) {
    case '/':
      res.statusCode = 200;
      res.end('Welcome to ew42.com (Secure!)');
      break;
    case '/about':
      res.statusCode = 200;
      res.end('About ew42.com (Secure!)');
      break;
    case '/contact':
      res.statusCode = 200;
      res.end('Contact Information for ew42.com (Secure!)');
      break;
    default:
      res.statusCode = 404;
      res.end('404 Not Found');
  }
};

// Create HTTPS server
const httpsServer = https.createServer(options, requestHandler);
httpsServer.listen(httpsPort, () => {
  log(`HTTPS Server running on port ${httpsPort}`);
});

// Create HTTP server to redirect to HTTPS
http.createServer((req, res) => {
  log(`HTTP Request redirected to HTTPS: ${req.headers.host}${req.url}`);
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(httpPort, () => {
  log(`HTTP to HTTPS redirect server running on port ${httpPort}`);
});

process.on('uncaughtException', (error) => {
  log(`Uncaught Exception: ${error.message}`);
  log('Server will attempt to continue running.');
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  log('Server will attempt to continue running.');
});

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app =  express();

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

app.get('/', (req, res) => {
  const clientIp = req.socket.remoteAddress;
  const userAgent = req.headers['user-agnet'];
  log('Https request from ${clientIp} - ${userAgent} for ${req.url}');
  res.send('Hello World!');
}

// const requestHandler = (req, res) => {
//   const clientIp = req.socket.remoteAddress;
//   const userAgent = req.headers['user-agent'];
//   log(`HTTPS Request from ${clientIp} - ${userAgent} for ${req.url}`);
//
//   //What is it requesting? What kind of file is that? Send it.
//
//   let filePath = (__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
//
//   let extname = path.extname(filePath);
//
//   let contentType = 'text/html';
//   switch (extname) {
//     case '.js':
//       contentType = 'text/javascript';
//       break
//     case '.css':
//       contentType = 'text/css';
//       break
//     case '.json':
//       contentType = 'applications/json';
//       break
//     case '.png':
//       contentType = 'image/png';
//       break
//     case '.jpg':
//       contentType = 'image/jpg';
//   }
//
//   fs.readFile(filePath, (error, content) => {
//       if (error) {
//         if (error.code === 'ENOENT') {
//           // File not found
//           fs.readFile(path.join(__dirname, 'public', '404.html'), (error, content) => {
//             res.writeHead(404, { 'Content-Type': 'text/html' });
//             res.end(content, 'utf-8');
//           });
//         }
//         else {
//           // Server error
//           res.writeHead(500);
//           res.end(`Server Error: ${error.code}`);
//         }
//       }
//         else {
//         // Success
//         res.writeHead(200, { 'Content-Type': contentType });
//         res.end(content, 'utf-8');
//       }
//     });
// };

// Create HTTPS server
const httpsServer = https.createServer(options, app);
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

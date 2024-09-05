const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');

const certPath = '/etc/letsencrypt/live/ew42.com/fullchain.pem';
const keyPath = '/etc/letsencrypt/live/ew42.com/privkey.pem';

const options = {
  cert: fs.readFileSync(certPath),
  key: fs.readFileSync(keyPath)
};

const httpsPort = 443;
const httpPort = 80;

// Replace this with your generated secret
const webhookSecret = 'ec6029c907a5f13527a8d44fd1cfab3dea100b90';

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${message}`);
}

function verifySignature(payload, signature) {
  const hmac = crypto.createHmac('sha1', webhookSecret);
  const digest = 'sha1=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

function pullAndRestart() {
  try {
    // Pull the latest changes
    log('Pulling latest changes...');
    const pullOutput = execSync('git pull origin main').toString();
    log(`Git pull output: ${pullOutput}`);

    // Stop the current server
    log('Stopping current server...');
    execSync('tmux send-keys -t your_session_name C-c');
    
    // Wait for the server to stop
    execSync('sleep 2');

    // Start the server in a new tmux window
    log('Starting server in a new tmux window...');
    execSync('tmux new-window -t your_session_name -n server "node server.js"');

    log('Server updated and restarted successfully');
  } catch (error) {
    log(`Error during update and restart: ${error.message}`);
  }
}

const requestHandler = (req, res) => {
  if (req.url === '/webhook' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const signature = req.headers['x-hub-signature'];
      if (!signature || !verifySignature(body, signature)) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        return res.end('Unauthorized');
      }
      
      const event = req.headers['x-github-event'];
      if (event === 'push') {
        log('Received a valid webhook push event');
        pullAndRestart();
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Webhook received successfully');
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Unsupported event type');
      }
    });
  } else {
    // Your existing route handling code here
    res.setHeader('Content-Type', 'text/plain');
    switch(req.url) {
      case '/':
        res.statusCode = 200;
        res.end('Welcome to ew42.com (Secureish.)');
        break;
      // ... other routes ...
      default:
        res.statusCode = 404;
        res.end('404 Not Found');
    }
  }
};

const httpsServer = https.createServer(options, requestHandler);
httpsServer.listen(httpsPort, () => {
  log(`HTTPS Server running on port ${httpsPort}`);
});

http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(httpPort, () => {
  log(`HTTP to HTTPS redirect server running on port ${httpPort}`);
});

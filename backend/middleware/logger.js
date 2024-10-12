const path = require('path');
const fs = require('fs');

const logger = function (req, res, next) {
  const logStream = fs.createWriteStream(path.join(__dirname, '../log/server.log'), {flags: 'a'});
  const timeStamp = new Date().toISOString();
  const clientIp = req.socket.remoteAddress;
  const message = `${timeStamp} - HTTPS ${req.method} from ${req.headers['user-agent']}/${clientIp} for ${req.url}`;
  console.log(message);
  logStream.write(message);
  next()
};

module.exports = logger;

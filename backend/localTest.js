const express = require('express');
const path = require('path');
const app = require('./app.js');
const http = require('http');

const port = 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Listening at localhost:${port}`);
});


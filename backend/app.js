const express = require('express');
const index = require('./routes/index');
const logger = require('./middleware/logger');
const path = require('path');

const app = express();

app.use(logger);
app.use('/', index);
app.use(express.static(path.join(__dirname, '../frontend/public/')));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'index.html'));
// });



module.exports = app;

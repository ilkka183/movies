const config = require('config');
const express = require('express');
const db = require('./common/mySQL/database');
const logger = require('./common/logger');

const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/config')();

const databaseConfig = {
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
}

db.connect(databaseConfig);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => logger.log(`Listening on port ${port}...`));

module.exports = server;


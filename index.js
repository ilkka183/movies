const express = require('express');
const app = express();

const logger = require('./common/logger');

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/config')();

const config = require('config');
const connection = require('./connection');

const port = process.env.PORT || 5000;
const server = app.listen(port, () => logger.log(`Listening on port ${port}...`));

const databaseConfig = {
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
}

connection.connect(databaseConfig, () => {});

module.exports = server;


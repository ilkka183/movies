require('dotenv').config();

const express = require('express');
const connection = require('./connection');
const logger = require('./common/logger');

const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/config')();

const config = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
}

connection.connect(config);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => logger.log(`Listening on port ${port}...`));

module.exports = server;


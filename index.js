const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/database')();

const logger = require('./common/logger');

const port = process.env.PORT || 5000;
const server = app.listen(port, () => logger.log(`Listening on port ${port}...`));

module.exports = server;

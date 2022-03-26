const config = require('config');
const Database = require('./common/mySQL/database');

const databaseConfig = {
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
}

const database = new Database(databaseConfig);

module.exports = database;

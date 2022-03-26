const db = require('../db');

module.exports = function () {
  db.connect();
}

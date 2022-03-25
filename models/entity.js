const Table = require('../common/mySQL/table');

class Entity extends Table {
  constructor(db) {
    super(db);
  }
}

module.exports = Entity;

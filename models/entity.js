const SqlEntity = require('../common/mySQL/sqlEntity');

class Entity extends SqlEntity {
  constructor(db) {
    super(db);
  }
}

module.exports = Entity;

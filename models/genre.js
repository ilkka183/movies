const Entity = require('../common/entity');

class Genre extends Entity {
  constructor(connection) {
    super(connection);

    this.addField('Id', { autoIncrement: true });
    this.addField('Name', { required: true, minLength: 5, maxLength: 50 });
  }
}

module.exports = Genre;

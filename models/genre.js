const Entity = require('./entity');

class Genre extends Entity {
  constructor(connection) {
    super(connection);

    this.addField('Id');
    this.addField('Name', { required: true, minLength: 5, maxLength: 50  });
  }
}

module.exports = Genre;

const Entity = require('./entity');

class Genre extends Entity {
  constructor(db) {
    super(db);

    this.addField('Id', { autoIncrement: true });
    this.addField('Name', { required: true, minLength: 5, maxLength: 50 });
  }
}

module.exports = Genre;

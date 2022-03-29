const Entity = require('./entity');

class Genre extends Entity {
  constructor(db) {
    super(db);

    this.addNumberField('Id', { autoIncrement: true });
    this.addStringField('Name', { required: true, minLength: 5, maxLength: 50 });
  }
}

module.exports = Genre;

const Entity = require('./entity');

class Movie extends Entity {
  constructor(db) {
    super(db);

    this.addNumberField('Id', { autoIncrement: true });
    this.addStringField('Title', { required: true });
    this.addNumberField('GenreId', { required: true });
    this.addNumberField('NumberInStock', { required: true, minValue: 0 });
    this.addNumberField('DailyRentalRate', { required: true, minValue: 0 });
  }
}

module.exports = Movie;

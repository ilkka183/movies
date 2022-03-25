const Entity = require('./entity');

class Movie extends Entity {
  constructor(db) {
    super(db);

    this.addField('Id', { autoIncrement: true });
    this.addField('Title', { required: true });
    this.addField('GenreId', { required: true });
    this.addField('NumberInStock', { required: true });
    this.addField('DailyRentalRate', { required: true });
  }
}

module.exports = Movie;

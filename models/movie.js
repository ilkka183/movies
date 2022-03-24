const Entity = require('../common/entity');

class Movie extends Entity {
  constructor(connection) {
    super(connection);

    this.addField('Id', { autoIncrement: true });
    this.addField('Title', { required: true });
    this.addField('GenreId', { required: true });
    this.addField('NumberInStock', { required: true });
    this.addField('DailyRentalRate', { required: true });
  }
}

module.exports = Movie;

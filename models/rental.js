const Entity = require('./entity');

class Rental extends Entity {
  constructor(db) {
    super(db);

    this.addNumberField('Id', { autoIncrement: true });
    this.addNumberField('CustomerId', { required: true });
    this.addNumberField('MovieId', { required: true });
    this.addDateField('DateOut', {});
    this.addDateField('DateReturned', {});
    this.addNumberField('RentalFee', {});
  }

  static async lookup(customerId, movieId) {
    const { results } = await this.db.query('SELECT * FROM Rental WHERE customerId = ' + customerId + ' AND movieId = ' + movieId);

    if (results.length > 0)
      return results[0];

    return null;
  }

  async return(rental, customer, movie) {
    const fee = movie.dailyRentalRate;

    await this.db.queryValues('UPDATE Rental SET dateReturned = CURDATE(), rentalFee = ? WHERE id = ?', [fee, rental.id]);
    await this.db.queryValues('UPDATE Movie SET numberInStock = numberInStock + 1 WHERE id = ?', [rental.movieId]);
  }
}

module.exports = Rental;

const Entity = require('../common/entity');

class Rental extends Entity {
  constructor(connection) {
    super(connection);

    this.addField('Id', { autoIncrement: true });
    this.addField('CustomerId', { required: true });
    this.addField('MovieId', { required: true });
    this.addField('DateOut', {});
    this.addField('DateReturned', {});
    this.addField('RentalFee', {});
  }

  static async lookup(customerId, movieId) {
    const { results } = await connection.query('SELECT * FROM Rental WHERE customerId = ' + customerId + ' AND movieId = ' + movieId);

    if (results.length > 0)
      return results[0];

    return null;
  }

  async return(rental, customer, movie) {
    const fee = movie.dailyRentalRate;

    await connection.queryValues('UPDATE Rental SET dateReturned = CURDATE(), rentalFee = ? WHERE id = ?', [fee, rental.id]);
    await connection.queryValues('UPDATE Movie SET numberInStock = numberInStock + 1 WHERE id = ?', [rental.movieId]);
  }
}

module.exports = Rental;

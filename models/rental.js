const connection = require('../connection');
const Entity = require('./entity');

class Rental extends Entity {
  static async findById(id) {
    const { results } = await connection.query('SELECT * FROM Rental WHERE id = ' + id);

    if (results.length > 0)
      return results[0];
  
    return null;
  }

  static async lookup(customerId, movieId) {
    const { results } = await connection.query('SELECT * FROM Rental WHERE customerId = ' + customerId + ' AND movieId = ' + movieId);

    if (results.length > 0)
      return results[0];

    return null;
  }

  static async return(rental, customer, movie) {
    const fee = movie.dailyRentalRate;

    await connection.queryValues('UPDATE Rental SET dateReturned = CURDATE(), rentalFee = ? WHERE id = ?', [fee, rental.id]);
    await connection.queryValues('UPDATE Movie SET numberInStock = numberInStock + 1 WHERE id = ?', [rental.movieId]);
  }

  static validate(rental) {
    if (!rental.customerId)
      return { message: 'CustomerId is required.' }
  
    if (!rental.movieId)
      return { message: 'MovieId is required.' }
  
    return null
  }
}

module.exports = Rental;

const connection = require('../connection');
const Entity = require('./entity');

class Rental extends Entity {
  static async findById(id) {
    const { results } = await connection.query('SELECT * FROM Rental WHERE id = ' + id);

    if (results.length > 0)
      return results[0];
  
    return null;
  }

  static async findByCustomerAndMovieId(customerId, movieId) {
    const { results } = await connection.query('SELECT * FROM Rental WHERE customerId = ' + customerId + ' AND movieId = ' + movieId);

    if (results.length > 0)
      return results[0];

    return null;
  }
}

module.exports = Rental;

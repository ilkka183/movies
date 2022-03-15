const connection = require('../connection');
const Entity = require('./entity');

class Movie extends Entity {
  static async findById(id) {
    const { results } = await connection.query('SELECT * FROM Movie WHERE Id = ' + id);

    if (results.length > 0)
      return results[0];
  
    return null;
  }
}

module.exports = Movie;


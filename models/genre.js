const connection = require('../connection');
const Entity = require('./entity');

class Genre extends Entity {
  static async findById(id) {
    const { results } = await connection.query('SELECT * FROM Genre WHERE id = ' + id);

    if (results.length > 0)
      return results[0];
  
    return null;
  }
}

module.exports = Genre;

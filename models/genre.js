const connection = require('../connection');
const Entity = require('./entity');

class Genre extends Entity {
  static async findById(id) {
    const { results } = await connection.query('SELECT * FROM Genre WHERE id = ' + id);

    if (results.length > 0)
      return results[0];
  
    return null;
  }

  static validate(genre) {
    if (!genre.name)
      return { message: 'Name is required.' }
  
    if (genre.name.length < 5)
      return { message: 'Name length have to be at least 5 characters.' }
  
    if (genre.name.length > 50)
      return { message: 'Name length have to be less than 50 characters.' }
  
    return null
  }
}

module.exports = Genre;

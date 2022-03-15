const connection = require('../connection');
const Entity = require('./entity');

class Customer extends Entity {
  static async findById(id) {
    const { results } = await connection.query('SELECT * FROM Customer WHERE Id = ' + id);

    if (results.length > 0)
      return results[0];
  
    return null;
  }
}

module.exports = Customer;


const jwt = require('jsonwebtoken');
const config = require('config');
const connection = require('../connection');
const Entity = require('./entity');

class User extends Entity {
  static getPrivateKey() {
    return config.get('jwtPrivateKey');
  }
  
  static generateToken(user) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    };
  
    const key = User.getPrivateKey();
    const token = jwt.sign(payload, key);
  
    return token;
  }

  static decodeToken(token) {
    return jwt.verify(token, User.getPrivateKey());
  }

  static async findByEmail(email) {
    const { results } = await connection.query('SELECT * FROM User WHERE Email = "' + email + '"');

    if (results.length > 0) {
      return results[0];

    }
  
    return null;
  }
}

module.exports = User;
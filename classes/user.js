const jwt = require('jsonwebtoken');
const config = require('config');
const connection = require('../connection');

class User {
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

  static async getByEmail(email) {
    try {
      const { results } = await connection.query('SELECT * FROM User WHERE Email = "' + email + '"');

      if (results.length > 0) {
        const row = results[0];
  
        return {
          id: row.Id,
          name: row.Name,
          email: row.Email,
          password: row.Password,
          isAdmin: row.IsAdmin === 1
        };
      }
    
      return null;
    }
    catch (ex) {
      return null;
    }
  }
}

module.exports = User;

const config = require('config');
const jwt = require('jsonwebtoken');
const db = require('../db');
const Entity = require('./entity');

class User extends Entity {
  constructor(db) {
    super(db);

    this.addNumberField('Id', { autoIncrement: true });
    this.addStringField('Name', { required: true });
    this.addStringField('Email', { required: true });
    this.addStringField('Password', { required: true });
    this.addBooleanField('IsAdmin', { required: true });
  }

  static getPrivateKey() {
    return config.jwtPrivateKey;
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
    const { results } = await db.query('SELECT * FROM User WHERE Email = "' + email + '"');

    if (results.length > 0) {
      return results[0];

    }
  
    return null;
  }
}

module.exports = User;

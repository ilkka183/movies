const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../../../models/user');

describe('User.generateToken', () => {

  const user = {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@gmail.com',
    isAdmin: true
  };

  it('should return the private key', () => {
    const key = User.getPrivateKey();

    expect(key).toBe(config.jwtPrivateKey);
  });

  
  it('should return a valid JWT', () => {
    const token = User.generateToken(user);
    const decoded = User.decodeToken(token);

    expect(decoded).toMatchObject(user);
  });

});


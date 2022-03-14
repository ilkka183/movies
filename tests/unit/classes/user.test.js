const jwt = require('jsonwebtoken');
const User = require('../../../classes/user');

describe('User.generateToken', () => {

  it('should return the private key', () => {
    const key = User.getPrivateKey();

    expect(key).toBe('1234');
  });

  it('should return a valid JWT', () => {
    const user = {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@gmail.com',
      isAdmin: true
    };

    const token = User.generateToken(user);
    const decoded = User.decodeToken(token);

    expect(decoded).toMatchObject(user);
  });

});


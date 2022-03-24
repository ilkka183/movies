const auth = require('../../../middleware/auth');
const User = require('../../../models/user');


describe('auth middleware', () => {

  const user = {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@gmail.com',
    isAdmin: false
  };

  it('should populate req.user with the payload of a valid JWT', () => {
    token = User.generateToken(user);

    const req = {
      header: jest.fn().mockReturnValue(token)
    };

    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user).toMatchObject(user);
  });

});

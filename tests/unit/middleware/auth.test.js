const auth = require('../../../middlewares/auth');
const User = require('../../../classes/user');


describe('auth middleware', () => {

  it('should populate req.user with the payload of a valid JWT', () => {
    const user = {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@gmail.com',
      isAdmin: false
    };
  
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

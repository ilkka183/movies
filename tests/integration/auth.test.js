const request = require('supertest');
const connection = require('../../connection');
const User = require('../../models/user');

let server;


describe('auth middleware', () => {

  const user = {
    name: 'John Smith',
    email: 'john.smith@gmail.com',
    password: 'dummy',
    isAdmin: 0
  };

  let token = '';
  
  function execute(body) {
    return request(server)
      .post('/api/genres/')
      .set('x-auth-token', token)
      .send({ name: 'Genre1' });
  }


  beforeEach(async () => {
    server = require('../../index');

    const { id } = await connection.insert('User', user);

    token = User.generateToken({ id, ...user });
  });


  afterEach(async () => {
    server.close();

    await connection.deleteAll('Genre');
    await connection.deleteAll('User');
  });


  it('should return 401 if no token has provided', async () => {
    token = '';

    const res = await execute();

    expect(res.status).toBe(401);
  });


  it('should return 400 if token is invalid', async () => {
    token = 'a';

    const res = await execute();

    expect(res.status).toBe(400);
  });


  it('should return 200 if token is valid', async () => {
    const res = await execute();

    expect(res.status).toBe(200);
  });

});

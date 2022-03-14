const request = require('supertest');
const db = require('./db');
const User = require('../../classes/user');

let server;


describe('auth middleware', () => {

  const user = {
    name: 'John Smith',
    email: 'john.smith@gmail.com',
    password: 'dummy',
    isAdmin: false
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

    const id = await db.insert('User', user);

    token = User.generateToken({ id, ...user });
  });

  afterEach(async () => {
    server.close();

    await db.deleteAll('Genre');
    await db.deleteAll('User');
  });

  it('should return 401 if no token is provide', async () => {
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

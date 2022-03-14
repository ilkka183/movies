const request = require('supertest');
const db = require('./db');
const User = require('../../classes/user');

let server;


describe('/api/genres', () => {

  beforeEach(() => {
    server = require('../../index');
  });

  afterEach(async () => {
    server.close();

    await db.deleteAll('User');
    await db.deleteAll('Genre');
  });

  describe('GET /', () => {

    it('should return all genres', async () => {
      await db.insert('Genre', { Name: 'Genre1' });
      await db.insert('Genre', { Name: 'Genre2' });
    
      const res = await request(server).get('/api/genres');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.Name === 'Genre1')).toBeTruthy();
      expect(res.body.some(g => g.Name === 'Genre2')).toBeTruthy();
    });

  });

  describe('GET /:id', () => {

    it('should return a genre if valid id is passed', async () => {
      const genre = { Name: 'Genre1' };
      const id = await db.insert('Genre', genre);
    
      const res = await request(server).get('/api/genres/' + id);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(genre);
    });

    it('should return a 404 if invalid id is passed', async () => {
      let res = await request(server).get('/api/genres/1');
      expect(res.status).toBe(404);

      res = await request(server).get('/api/genres/a');
      expect(res.status).toBe(404);
    });

  });


  describe('POST /', () => {

    const user = {
      name: 'John Smith',
      email: 'john.smith@gmail.com',
      password: 'dummy',
      isAdmin: false
    };

    let token = '';

    async function execute(body) {
      return await request(server)
        .post('/api/genres/')
        .set('x-auth-token', token)
        .send(body);
    }

    beforeEach(async () => {
      const id = await db.insert('User', user);

      token = User.generateToken({ id, ...user });
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await execute(undefined);

      expect(res.status).toBe(401);
    });

    it('should return 400 if genre is less than 5 character', async () => {
      const res = await execute({ name: '1234' });

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 character', async () => {
      const res = await execute({ name: new Array(52).join('a') });

      expect(res.status).toBe(400);
    });

    it('should save the genre if it is valid', async () => {
      const res = await execute({ name: 'Genre1' });

      expect(res.status).toBe(200);
      expect(res.body).not.toBeNull();
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'Genre1');
    });

  });

});
const request = require('supertest');
const db = require('./db');
const Genre = require('../../models/genre');
const User = require('../../models/user');


describe('/api/genres', () => {

  const user = {
    name: 'John Smith',
    email: 'john.smith@gmail.com',
    password: 'dummy',
    isAdmin: 1
  };

  let server = null;


  beforeEach(() => {
    server = require('../../index');
  });


  afterEach(async () => {
    await db.deleteAll('User');
    await db.deleteAll('Genre');

    await server.close();
  });


  //
  // GET
  //

  describe('GET /', () => {

    it('should return all genres', async () => {
      await db.insert('Genre', { name: 'Genre1' });
      await db.insert('Genre', { name: 'Genre2' });
    
      const res = await request(server).get('/api/genres');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'Genre1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'Genre2')).toBeTruthy();
    });

  });


  describe('GET /:id', () => {

    it('should return a genre if valid id is passed', async () => {
      const genre = { name: 'Genre1' };
      const { id } = await db.insert('Genre', genre);
    
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


  //
  // POST
  //

  describe('POST /', () => {

    let token = '';

    function execute(body) {
      return request(server)
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


  //
  // PUT
  //

  describe('PUT /:id', () => {

    let token = '';

    function execute(id, body) {
      return request(server)
        .put('/api/genres/' + id)
        .set('x-auth-token', token)
        .send(body);
    }


    beforeEach(async () => {
      const { id } = await db.insert('User', user);

      token = User.generateToken({ id, ...user });
    });


    it('should update a genre if valid id is given', async () => {
      const { id } = await db.insert('Genre', { name: 'Genre1' });
      const genre = { name: 'Genre2' }

      const res = await execute(id, genre);

      expect(res.status).toBe(200);
    });


    it('should return 400 if invalid id is given', async () => {
      const { id } = await db.insert('Genre', { name: 'Genre1' });
      const genre = { name: 'Genre2' }

      const res = await execute(999, genre);

      expect(res.status).toBe(404);
    });

  });


  //
  // DELETE
  //

  describe('DELETE /:id', () => {

    let token = '';

    function execute(id) {
      return request(server)
        .delete('/api/genres/' + id)
        .set('x-auth-token', token);
    }


    beforeEach(async () => {
      const { id } = await db.insert('User', user);
      
      token = User.generateToken({ id, ...user });
    });


    it('should delete a genre if valid id is given', async () => {
      const { id } = await db.insert('Genre', { name: 'Genre1' });

      const res = await execute(id);

      expect(res.status).toBe(200);
    });

    
    it('should return 400 if invalid id is given', async () => {
      const { id } = await db.insert('Genre', { name: 'Genre1' });

      const res = await execute(1);

      expect(res.status).toBe(404);
    });

  });

});
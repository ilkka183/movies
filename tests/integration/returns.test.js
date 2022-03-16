const request = require('supertest');
const db = require('./db');
const Movie = require('../../models/movie');
const Rental = require('../../models/rental');
const User = require('../../models/user');


describe('/api/returns', () => {

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
    await db.deleteAll('Rental');
    await db.deleteAll('Movie');
    await db.deleteAll('Genre');
    await db.deleteAll('Customer');
    await db.deleteAll('User');

    await server.close();
  });


  //
  // POST
  //

  describe('POST /', () => {

    let token = '';

    let customer = null;
    let movie = null;
    let rental = null;
  
    function execute(body) {
      return request(server)
        .post('/api/returns/')
        .set('x-auth-token', token)
        .send(body);
    }
  
  
    beforeEach(async () => {
      const { id } = await db.insert('User', user);

      token = User.generateToken({ id, ...user });

      customer = await db.insert('Customer', { name: 'Matt Damon' });
      const genre = await db.insert('Genre', { name: 'Scifi'  });
      movie = await db.insert('Movie', { title: 'Star Wars', genreId: genre.id, numberInStock: 10, dailyRentalRate: 2  });
      rental = await db.insert('Rental', { customerId: customer.id, movieId: movie.id });
    });
  
  
    it('should return 401 if client is not logged in', async () => {
      token = '';
  
      const res = await execute({ customerId: customer.id, movieId: movie.id });
  
      expect(res.status).toBe(401);
    });
  
  
    it('should return 400 if customerId is not provided', async () => {
      const res = await execute({ movieId: movie.id });
  
      expect(res.status).toBe(400);
    });
  
  
    it('should return 400 if movieId is not provided', async () => {
      const res = await execute({ customerId: customer.id });
  
      expect(res.status).toBe(400);
    });
  
  
    it('should return 404 if no reltal found for this customer/movie', async () => {
      await db.deleteAll('Rental');
  
      const res = await execute({ customerId: customer.id, movieId: movie.id });
  
      expect(res.status).toBe(404);
    });
  
  
    it('should return 400 if rental already processed', async () => {
      await db.update('Rental', rental.id, { dateReturned: '2022-03-15' });
  
      const res = await execute({ customerId: customer.id, movieId: movie.id });
  
      expect(res.status).toBe(400);
    });
  
  
    it('should return 200 if we have avalid request', async () => {
      const res = await execute({ customerId: customer.id, movieId: movie.id });
  
      expect(res.status).toBe(200);
    });
  
  
    it('should set the returnDate if input is valid', async () => {
      const res = await execute({ customerId: customer.id, movieId: movie.id });
  
      const obj = await Rental.findById(rental.id);
  
      expect(obj.dateReturned).toBeDefined();
    });
  
  
    it('should set the rental fee if input is valid', async () => {
      await db.update('Rental', rental.id, { dateOut: '2022-03-10' });
  
      const res = await execute({ customerId: customer.id, movieId: movie.id });
  
      const obj = await Rental.findById(rental.id);
  
      expect(obj.rentalFee).toBeDefined();
    });
  
  
    it('should increase the movie stock if input is valid', async () => {
      const res = await execute({ customerId: customer.id, movieId: movie.id });
  
      const obj = await Movie.findById(movie.id);
  
      expect(obj.numberInStock).toBe(movie.numberInStock + 1);
    });
  
    
    it('should return the rental if input is valid', async () => {
      const res = await execute({ customerId: customer.id, movieId: movie.id });
  
      const obj = await Rental.findById(rental.id);
  
      expect(res.body).toHaveProperty('customerId');
      expect(res.body).toHaveProperty('movieId');
      expect(res.body).toHaveProperty('dateOut');
      expect(res.body).toHaveProperty('dateReturned');
      expect(res.body).toHaveProperty('rentalFee');
    });
  
  });

});
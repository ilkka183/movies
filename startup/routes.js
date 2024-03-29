const express = require('express');
const cors = require('cors');

const auth = require('../routes/auth');
const customers = require('../routes/customers');
const genres = require('../routes/genres');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const returns = require('../routes/returns');
const users = require('../routes/users');

const error = require('../middleware/error');


module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  
  app.use('/api/auth', auth);
  app.use('/api/customers', customers);
  app.use('/api/genres', genres);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/returns', returns);
  app.use('/api/users', users);

  app.use(error);
}

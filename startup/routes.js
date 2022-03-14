const express = require('express');
const cors = require('cors');

const auth = require('../route/auth');
const customers = require('../route/customers');
const genres = require('../route/genres');
const movies = require('../route/movies');
const rentals = require('../route/rentals');
const users = require('../route/users');

const error = require('../middleware/error');


module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  
  app.use('/api/auth', auth);
  app.use('/api/customers', customers);
  app.use('/api/genres', genres);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);

  app.use(error);
}
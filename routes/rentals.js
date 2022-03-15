const express = require('express');
const connection = require('../connection');
const wrap = require('../middleware/wrap');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Customer = require('../models/customer');
const Movie = require('../models/movie');

const router = express.Router();

const notFound = 'The rental with the given ID was not found.';


function validate(rental) {
  if (!rental.customerId)
    return { message: 'CustomerId is required.' }

  if (!rental.movieId)
    return { message: 'MovieId is required.' }

  return null
}


router.get('/', wrap(async (req, res) => {
  const { results } = await connection.query('SELECT * FROM Rental');
  res.send(results);
}));


router.get('/:customerId', wrap(async (req, res) => {
  const customerId = parseInt(req.params.customerId);

  const { results } = await connection.query('SELECT * FROM Rental WHERE CustomerId = ' + customerId);
  res.send(results);
}));


router.post('/', auth, wrap(async (req, res, next) => {
  const error = validate(req.body);

  if (error)
    return res.status(400).send(error.message);

  const customer = await Customer.findById(req.body.customerId);

  if (!customer)
    return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);

  if (!movie)
    return res.status(400).send('Invalid movie.');

  if (!movie.numberOfStock === 0)
    return res.status(400).send('Movie not in stock.');
  
  const body = { ...req.body };

  const { results } = await connection.queryValues('INSERT INTO Rental SET ?', body);

  body.id = results.insertId;
    
  res.send(body);
}));


module.exports = router;

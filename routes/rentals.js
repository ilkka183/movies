const express = require('express');
const connection = require('../connection');
const auth = require('../middleware/auth');
const wrap = require('../middleware/wrap');
const validate = require('../middleware/validate');
const Customer = require('../models/customer');
const Movie = require('../models/movie');
const Rental = require('../models/rental');

const router = express.Router();

const notFound = 'The rental with the given ID was not found.';


router.get('/', wrap(async (req, res) => {
  const rows = await connection.selectMany('SELECT * FROM Rental');

  res.send(rows);
}));


router.get('/:customerId', wrap(async (req, res) => {
  const customerId = parseInt(req.params.customerId);

  const row = await connection.selectSingle('SELECT * FROM Rental WHERE customerId = ' + customerId);
  
  res.send(row);
}));


router.post('/', [auth, validate(Rental.validate)], wrap(async (req, res, next) => {
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

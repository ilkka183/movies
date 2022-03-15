const express = require('express');
const connection = require('../connection');
const wrap = require('../middleware/wrap');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Customer = require('../models/customer');
const Movie = require('../models/movie');
const Rental = require('../models/rental');
const { DATETIME } = require('mysql/lib/protocol/constants/types');

const router = express.Router();

const notFound = 'The rental with the given ID was not found.';


function validate(rental) {
  if (!rental.customerId)
    return { message: 'CustomerId is required.' }

  if (!rental.movieId)
    return { message: 'MovieId is required.' }

  return null
}


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

  const rental = await Rental.findByCustomerAndMovieId(req.body.customerId, req.body.movieId);

  if (!rental)
    return res.status(404).send('No rental found.');

  if (rental.dateReturned)
    return res.status(400).send('Rental already processed.');

  await connection.queryValues('UPDATE Rental SET dateReturned = CURDATE(), rentalFee = ? WHERE Id = ?', [10, rental.id]);
  await connection.queryValues('UPDATE Movie SET numberInStock = numberInStock + 1 WHERE Id = ?', [movie.id]);

  const body = await Rental.findById(rental.id);

  res.send(body);
}));


module.exports = router;

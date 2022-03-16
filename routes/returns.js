const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const wrap = require('../middleware/wrap');
const Customer = require('../models/customer');
const Movie = require('../models/movie');
const Rental = require('../models/rental');

const router = express.Router();


router.post('/', [auth, validate(Rental.validate)], wrap(async (req, res, next) => {
  // Check customerId
  const customer = await Customer.findById(req.body.customerId);

  if (!customer)
    return res.status(400).send('Invalid customer.');

  // Check movieId
  const movie = await Movie.findById(req.body.movieId);

  if (!movie)
    return res.status(400).send('Invalid movie.');

  // Check if the rental exists
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental)
    return res.status(404).send('No rental found.');

  if (rental.dateReturned)
    return res.status(400).send('Rental already processed.');

  // Update the rental
  await Rental.return(rental, customer, movie);

  const body = await Rental.findById(rental.id);

  res.send(body);
}));


module.exports = router;

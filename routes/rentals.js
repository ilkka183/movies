const express = require('express');
const connection = require('../connection');
const asyncMiddleware = require('../middlewares/async');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

const router = express.Router();

const notFound = 'The rental with the given ID was not found.';


router.get('/', asyncMiddleware(async (req, res) => {
  const { results } = await connection.query('SELECT * FROM Rental');
  res.send(results);
}));


router.get('/:customerId', asyncMiddleware(async (req, res) => {
  const customerId = parseInt(req.params.customerId);

  const { results } = await connection.query('SELECT * FROM Rental WHERE CustomerId = ' + customerId);
  res.send(results);
}));


module.exports = router;

const express = require('express');
const connection = require('../connection');
const wrap = require('../middleware/wrap');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

const notFound = 'The rental with the given ID was not found.';


router.get('/', wrap(async (req, res) => {
  const { results } = await connection.query('SELECT * FROM Rental');
  res.send(results);
}));


router.get('/:customerId', wrap(async (req, res) => {
  const customerId = parseInt(req.params.customerId);

  const { results } = await connection.query('SELECT * FROM Rental WHERE CustomerId = ' + customerId);
  res.send(results);
}));


module.exports = router;

const express = require('express');
const connection = require('../connection');
const asyncMiddleware = require('../middlewares/async');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

const router = express.Router();

const notFound = 'The customer with the given ID was not found.';


router.get('/', asyncMiddleware(async (req, res) => {
  const { results } = await connection.query('SELECT * FROM Customer ORDER BY Id');
  res.send(results);
}));


router.get('/:id', asyncMiddleware(async (req, res) => {
  const id = parseInt(req.params.id);

  const { results } = await connection.query('SELECT * FROM Customer WHERE Id = ' + id);

  if (results.length === 0)
    return res.status(404).send(notFound);
      
  res.send(results[0]);
}));


module.exports = router;

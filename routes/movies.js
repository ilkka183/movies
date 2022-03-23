const express = require('express');
const connection = require('../connection');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const validateId = require('../middleware/validateId');
const wrap = require('../middleware/wrap');
const Movie = require('../models/movie');

const router = express.Router();

const notFound = 'The movie with the given ID was not found.';


router.get('/', wrap(async (req, res) => {
  const rows = await connection.selectMany('SELECT * FROM Movie ORDER BY Id');
  
  res.send(rows);
}));


router.get('/:id', validateId, wrap(async (req, res) => {
  const id = parseInt(req.params.id);

  const row = await connection.selectSingle('Movie', id);
  
  if (!row)
    return res.status(404).send(notFound);

  res.send(row);
}));


router.post('/', [auth, validate(Movie.validate)], wrap(async (req, res) => {
  const result = await connection.insert('Movie', req.body);
  
  res.send(result);
}));


router.patch('/:id', [auth, validateId, validate(Movie.validate)], wrap(async (req, res) => {
  const id = parseInt(req.params.id);

  const result = await connection.update('Movie', id, req.body);

  if (!result)
    return res.status(404).send(notFound);

  res.send(result);
}));


router.delete('/:id', [auth, admin, validateId], wrap(async (req, res) => {
  const id = parseInt(req.params.id);

  const result = await connection.delete('DELETE', id);
  
  if (!result)
    return res.status(404).send(notFound);

  res.send(result);
}));


module.exports = router;

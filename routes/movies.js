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
  const { results } = await connection.query('SELECT * FROM Movie ORDER BY Id');
  
  res.send(results);
}));


router.get('/:id', validateId, wrap(async (req, res) => {
  const id = parseInt(req.params.id);

  const { results } = await connection.query('SELECT * FROM Movie WHERE Id = ' + id);
  
  if (results.length === 0)
    return res.status(404).send(notFound);

  res.send(results[0]);
}));


router.post('/', [auth, validate(Movie.validate)], wrap(async (req, res) => {
  const body = { ...req.body };

  const { results } = await connection.queryValues('INSERT INTO Movie SET ?', body);
  
  body.id = results.insertId;

  res.send(results);
}));


router.put('/:id', [auth, validateId, validate(Movie.validate)], wrap(async (req, res) => {
  const id = parseInt(req.params.id);

  const body = { ...req.body, id }

  const { results } = await connection.queryValues('UPDATE Movie SET Title = ? WHERE Id = ?', [body.title, id]);
  res.send(results);
}));


router.delete('/:id', [auth, admin, validateId], wrap(async (req, res) => {
  const id = parseInt(req.params.id);

  const { results } = await connection.query('DELETE FROM Movie WHERE Id = ' + id);
  
  if (results.affectedRows === 0)
    return res.status(404).send(notFound);

  res.send(results);
}));


module.exports = router;

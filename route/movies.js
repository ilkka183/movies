const express = require('express');
const connection = require('../connection');
const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

const notFound = 'The movie with the given ID was not found.';


function validate(item) {
  if (!item.title)
    return { message: 'Title is required.' }

  return null
}


router.get('/', asyncMiddleware(async (req, res) => {
  const { results } = await connection.query('SELECT * FROM Movie ORDER BY Id');
  res.send(results);
}));


router.get('/:id', asyncMiddleware(async (req, res) => {
  const id = parseInt(req.params.id);

  const { results } = await connection.query('SELECT * FROM Movie WHERE Id = ' + id);
  
  if (results.length === 0)
    return res.status(404).send(notFound);

  res.send(results[0]);
}));


router.post('/', auth, asyncMiddleware(async (req, res) => {
  const error = validate(req.body);

  if (error)
    return res.status(400).send(error.message);

  const body = { ...req.body };

  const { results } = await connection.queryValues('INSERT INTO Movie SET ?', body);
  
  body.id = results.insertId;

  res.send(results);
}));


router.put('/:id', auth, asyncMiddleware(async (req, res) => {
  const id = parseInt(req.params.id);

  const error = validate(req.body);

  if (error)
    return res.status(400).send(error.message);

  const body = { ...req.body, id }

  const { results } = await connection.queryValues('UPDATE Movie SET Title = ? WHERE Id = ?', [body.title, id]);
  res.send(results);
}));


router.delete('/:id', [auth], asyncMiddleware(async (req, res) => {
  const id = parseInt(req.params.id);

  const { results } = await connection.query('DELETE FROM Movie WHERE Id = ' + id);
  
  if (results.affectedRows === 0)
    return res.status(404).send(notFound);

  res.send(results);
}));


module.exports = router;

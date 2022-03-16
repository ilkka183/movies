const express = require('express');
const connection = require('../connection');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const validateId = require('../middleware/validateId');
const wrap = require('../middleware/wrap');
const Genre = require('../models/genre');

const router = express.Router();

const notFound = 'The genre with the given ID was not found.';


router.get('/', wrap(async (req, res) => {
  const { results } = await connection.query('SELECT * FROM Genre ORDER BY Id');

  res.send(results);
}));


router.get('/:id', validateId, wrap(async (req, res) => {
  const id = parseInt(req.params.id);

  const { results } = await connection.query('SELECT * FROM Genre WHERE Id = ' + id);

  if (results.length === 0)
    return res.status(404).send(notFound);
      
  res.send(results[0]);
}));


router.post('/', [auth, validate(Genre.validate)], wrap(async (req, res, next) => {
  const body = { ...req.body };

  const { results } = await connection.queryValues('INSERT INTO Genre SET ?', body);

  body.id = results.insertId;
    
  res.send(body);
}));


router.put('/:id', [auth, validateId, validate(Genre.validate)], wrap(async (req, res, next) => {
  const id = parseInt(req.params.id);

  const body = { ...req.body, id }

  const { results } = await connection.queryValues('UPDATE Genre SET Name = ? WHERE Id = ?', [body.name, id]);

  if (results.affectedRows === 0)
    return res.status(404).send(notFound);

  res.send(body);
}));


router.delete('/:id', [auth, admin, validateId], wrap(async (req, res, next) => {
  const id = parseInt(req.params.id);

  const { results } = await connection.query('DELETE FROM Genre WHERE Id = ' + id);

  if (results.affectedRows === 0)
    return res.status(404).send(notFound);
      
  res.send(results);
}));


module.exports = router;

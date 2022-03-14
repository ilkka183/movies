const express = require('express');
const connection = require('../connection');
const validateId = require('../middleware/validateId');
const wrap = require('../middleware/wrap');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

const notFound = 'The genre with the given ID was not found.';


function validate(genre) {
  if (!genre.name)
    return { message: 'Name is required.' }

  if (genre.name.length < 5)
    return { message: 'Name length have to be at least 5 characters.' }

  if (genre.name.length > 50)
    return { message: 'Name length have to be less than 50 characters.' }

  return null
}


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


router.post('/', auth, wrap(async (req, res, next) => {
  const error = validate(req.body);

  if (error)
    return res.status(400).send(error.message);

  const body = { ...req.body };

  const { results } = await connection.queryValues('INSERT INTO Genre SET ?', body);

  body.id = results.insertId;
    
  res.send(body);
}));


router.put('/:id', [auth, validateId], wrap(async (req, res, next) => {
  const id = parseInt(req.params.id);

  const error = validate(req.body);

  if (error)
    return res.status(400).sendValues(error.message);

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

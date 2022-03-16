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
  const rows = await connection.selectMany('SELECT * FROM Genre ORDER BY id');

  res.send(rows);
}));


router.get('/:id', validateId, wrap(async (req, res) => {
  const id = parseInt(req.params.id);

  const row = await connection.selectSingle('Genre', id);

  if (!row)
    return res.status(404).send(notFound);
      
  res.send(row);
}));


router.post('/', [auth, validate(Genre.validate)], wrap(async (req, res, next) => {
  const result = await connection.insert('Genre', req.body);

  res.send(result);
}));


router.put('/:id', [auth, validateId, validate(Genre.validate)], wrap(async (req, res, next) => {
  const id = parseInt(req.params.id);

  const result = await connection.update('Genre', id, req.body);

  if (!result)
    return res.status(404).send(notFound);

  res.send(result);
}));


router.delete('/:id', [auth, admin, validateId], wrap(async (req, res, next) => {
  const id = parseInt(req.params.id);

  const result = await connection.delete('Genre', id);

  if (!result)
    return res.status(404).send(notFound);
      
  res.send(result);
}));


module.exports = router;

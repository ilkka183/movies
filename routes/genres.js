const express = require('express');
const connection = require('../connection');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const validateId = require('../middleware/validateId');
const Genre = require('../models/genre');

const router = express.Router();


router.get('/', async (req, res, next) => {
  try {
    const rows = await connection.selectMany('SELECT * FROM Genre ORDER BY Id');

    res.send(rows.map(row => Genre.toObj(row)));
  }
  catch (ex) {
    next(ex);
  }
});


router.get('/:id', validateId, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const row = await connection.selectSingle('Genre', id);
  
    if (!row)
      return res.status(404).send(Genre.notFoundMessage(id));
        
    res.send(Genre.toObj(row));
  }
  catch (ex) {
    next(ex);
  }
});


router.post('/', auth, async (req, res, next) => {
  try {
    const error = Genre.validate(req.body);

    if (error)
      return res.status(400).send(error.message);

    const row = await connection.insert('Genre', Genre.toRow(req.body));

    res.status(201).send(Genre.toObj(row));
  }
  catch (ex) {
    next(ex);
  }
});


router.patch('/:id', [auth, validateId], async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const error = Genre.validate(req.body);

    if (error)
      return res.status(400).send(error.message);

    const row = await connection.update('Genre', id, Genre.toRow(req.body));
  
    if (!row)
      return res.status(404).send(Genre.notFoundMessage(id));
  
    res.send(Genre.toObj(row));
  }
  catch (ex) {
    next(ex);
  }
});


router.delete('/:id', [auth, /* admin, */ validateId], async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const row = await connection.delete('Genre', id);
  
    if (!row)
      return res.status(404).send(Genre.notFoundMessage(id));
        
    res.send(Genre.toObj(row));
  }
  catch (ex) {
    next(ex);
  }
});


module.exports = router;

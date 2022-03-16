const express = require('express');
const connection = require('../connection');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const validateId = require('../middleware/validateId');
const wrap = require('../middleware/wrap');
const Customer = require('../models/customer');

const router = express.Router();

const notFound = 'The customer with the given ID was not found.';


router.get('/', wrap(async (req, res) => {
  const { results } = await connection.query('SELECT * FROM Customer ORDER BY Id');

  res.send(results);
}));


router.get('/:id', validateId, wrap(async (req, res) => {
  const id = parseInt(req.params.id);

  const { results } = await connection.query('SELECT * FROM Customer WHERE Id = ' + id);

  if (results.length === 0)
    return res.status(404).send(notFound);
      
  res.send(results[0]);
}));


router.post('/', [auth, validate(Customer.validate)], wrap(async (req, res, next) => {
  const body = { ...req.body };

  const { results } = await connection.queryValues('INSERT INTO Customer SET ?', body);

  body.id = results.insertId;
    
  res.send(body);
}));


router.delete('/:id', [auth, admin, validateId], wrap(async (req, res, next) => {
  const id = parseInt(req.params.id);

  const { results } = await connection.query('DELETE FROM Customer WHERE Id = ' + id);

  if (results.affectedRows === 0)
    return res.status(404).send(notFound);
      
  res.send(results);
}));


module.exports = router;

const express = require('express');
const connection = require('../connection');
const asyncMiddleware = require('../middlewares/async');
const auth = require('../middlewares/auth');
const User = require('../classes/user');

const router = express.Router();

const notFound = 'The user with the given ID was not found.';


function validate(user) {
  if (!user.name)
    return { message: 'Name is required.' }

  if (!user.email)
    return { message: 'Email is required.' }

  if (!user.password)
    return { message: 'Password is required.' }

  return null
}


router.get('/', asyncMiddleware(async (req, res) => {
  const { results } = await connection.query('SELECT * FROM User ORDER BY Id');
  res.send(results);
}));

router.get('/me', auth, asyncMiddleware(async (req, res) => {
  const id = req.user.id;

  const { results } = await connection.query('SELECT * FROM User WHERE Id = ' + id);

  if (results.length === 0)
    return res.status(404).send(notFound);
      
  res.send(results[0]);
}));


router.post('/', asyncMiddleware(async (req, res) => {
  const error = validate(req.body);

  if (error)
    return res.status(400).send(error.message);

  let user = await User.getByEmail(req.body.email);

  if (user !== null)
    return res.status(400).send('User already registered.');

  user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    isAdmin: req.body.isAdmin
  }

  const { results } = await connection.queryValues('INSERT INTO User SET ?', body);

  body.id = results.insertId;

  const token = User.generateToken(user);

  res.header('x-auth-token', token).header('access-control-expose-headers', 'x-auth-token').send(user);
}));


module.exports = router;

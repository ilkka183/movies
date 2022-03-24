const express = require('express');
const connection = require('../common/connection');
const auth = require('../middleware/auth');
const User = require('../models/user');

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


router.get('/', async (req, res) => {
  try {
    const { results } = await connection.query('SELECT * FROM User ORDER BY Id');

    res.send(results);
  }
  catch (ex) {
    next(ex);
  }
});


router.get('/me', auth, async (req, res) => {
  try {
    const id = req.user.id;

    const { results } = await connection.query('SELECT * FROM User WHERE Id = ' + id);
  
    if (results.length === 0)
      return res.status(404).send(notFound);
        
    res.send(results[0]);
  }
  catch (ex) {
    next(ex);
  }
});


router.post('/', async (req, res) => {
  try {
    const error = validate(req.body);
  
    if (error)
      return res.status(400).send(error.message);

    let user = await User.findByEmail(req.body.email);

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
  }
  catch (ex) {
    next(ex);
  }
});


module.exports = router;

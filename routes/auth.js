const express = require('express');
const validate = require('../middleware/validate');
const wrap = require('../middleware/wrap');
const User = require('../models/user');

const router = express.Router();


// Validation for login
function validateUser(user) {
  if (!user.email)
    return { message: 'Email is required.' }

  if (!user.password)
    return { message: 'Password is required.' }

  return null
}


router.post('/', validate(validateUser), wrap(async (req, res) => {
  const user = await User.findByEmail(req.body.email);

  if (!user)
    return res.status(400).send('Invalid email or password.');

  if (user.password !== req.body.password)
    return res.status(400).send('Invalid email or password.');

  const token = User.generateToken(user);

  res.send(token);
}));


module.exports = router;

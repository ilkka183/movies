const express = require('express');
const wrap = require('../middleware/wrap');
const User = require('../classes/user');

const router = express.Router();


function validate(user) {
  if (!user.email)
    return { message: 'Email is required.' }

  if (!user.password)
    return { message: 'Password is required.' }

  return null
}


router.post('/', wrap(async (req, res) => {
  const error = validate(req.body);

  if (error)
    return res.status(400).send(error.message);

  const user = await User.getByEmail(req.body.email);

  if (!user)
    return res.status(400).send('Invalid email or password.');

  if (user.password !== req.body.password)
    return res.status(400).send('Invalid email or password.');

  const token = User.generateToken(user);

  res.send(token);
}));


module.exports = router;

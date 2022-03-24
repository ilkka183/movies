const express = require('express');
const User = require('../models/user');

const invalidEmailOrPassword = 'Invalid email or password.';

const router = express.Router();


function validate(user) {
  if (!user.email)
    return { message: 'Email is required.' }

  if (!user.password)
    return { message: 'Password is required.' }

  return null
}


router.post('/', async (req, res, next) => {
  try {
    const error = validate(req.body);
  
    if (error)
      return res.status(400).send(error.message);
 
    const user = await User.findByEmail(req.body.email);
   
    if (!user)
      return res.status(400).send(invalidEmailOrPassword);
  
    if (user.password !== req.body.password)
      return res.status(400).send(invalidEmailOrPassword);
  
    const token = User.generateToken(user);
  
    res.send(token);
  }
  catch (ex) {
    next(ex);
  }
});


module.exports = router;

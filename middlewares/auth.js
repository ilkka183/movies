const User = require('../classes/user');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token)
    return res.status(401).send('Acces denined. No token provided.');

  try {
    const user = User.decodeToken(token);
    req.user = user;

    next();
  }
  catch (e) {
    res.status(400).send('Invalid token.');
  }
}

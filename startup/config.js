const User = require('../models/user');

module.exports = function () {
  if (!User.getPrivateKey()) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
}

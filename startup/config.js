const User = require('../classes/user');

module.exports = function () {
  if (!User.getPrivateKey()) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
}

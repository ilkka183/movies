const logger = require('../common/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.message);
    
  res.status(500).send('Something failed.');
} ; 
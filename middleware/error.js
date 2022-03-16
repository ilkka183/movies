const fs = require('fs');

const logger = fs.createWriteStream('log.txt', { flags: 'a' });

module.exports = (err, req, res, next) => {
  logger.write(err.message + '\n');
    
  res.status(500).send('Something failed.');
} ; 
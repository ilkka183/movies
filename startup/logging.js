const logger = require('../common/logger');

module.exports = function () {
  process.on('uncaughtException', ex => {
    console.log(ex);
    logger.error('WE GOT AN UNCAUGHT EXCEPTION');

    process.exit(1);
  });
  
  process.on('unhandledRejection', ex => {
    logger.error('WE GOT AN UNHANDLED REJECTION');
    
    process.exit(1);
  });
}
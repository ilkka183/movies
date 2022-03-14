module.exports = function () {
  process.on('uncaughtException', ex => {
    console.error('WE GOT AN UNCAUGHT EXCEPTION');
    // log
    process.exit(1);
  });
  
  process.on('unhandledRejection', ex => {
    console.error('WE GOT AN UNHANDLED REJECTION');
    // log
    process.exit(1);
  });
}
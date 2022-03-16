const fs = require('fs');

class Logger {
  constructor() {
    this.file = fs.createWriteStream('log.txt', { flags: 'a' });
  }

  log(text) {
    this.file.write(new Date().toISOString());
    this.file.write(' ');
    this.file.write(text);
    this.file.write('\n');

    console.log(text);
  }

  error(text) {
    this.log(text);
  }
}

const logger = new Logger();

module.exports = logger;
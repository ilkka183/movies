const fs = require('fs');

class Logger {
  constructor() {
    this.file = fs.createWriteStream('log.txt', { flags: 'a' });
  }

  log(text) {
    const now = new Date().toISOString();

    this.file.write(`${now} ${text}\n`);

    console.log(text);
  }

  error(text) {
    this.log(text);
  }
}

const logger = new Logger();

module.exports = logger;
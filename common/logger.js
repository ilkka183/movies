const fs = require('fs');

class Logger {
  constructor() {
    this.file = fs.createWriteStream('log.txt', { flags: 'a' });
  }

  writeToFile(text) {
    const now = new Date().toISOString();

    this.file.write(`${now} ${text}\n`);
  }

  log(text) {
    this.writeToFile(text);
    console.log(text);
  }

  error(text) {
    this.writeToFile(text);
    console.error(text);
  }
}

const logger = new Logger();

module.exports = logger;

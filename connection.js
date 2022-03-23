const mysql = require('mysql');

class Connection {
  connect(config) {
    this.connection = mysql.createConnection(config);

    this.connection.connect(err => {
      console.log(`Connedted to ${config.database}...`);

      if (err)
        throw new Error('Error connecting: ' + err.stack);
    });
  }

  query(sql) {
    const promise = new Promise((resolve, reject) => {
      this.connection.query(sql, (error, results, fields) => {
        if (error)
          reject(error);
    
        resolve({ results, fields });
      });
    });

    return promise;
  }

  queryValues(sql, values) {
    const promise = new Promise((resolve, reject) => {
      this.connection.query(sql, values, (error, results, fields) => {
        if (error)
          reject(error);
    
        resolve({ results, fields });
      });
    });

    return promise;
  }
}

const connection = new Connection();

module.exports = connection;

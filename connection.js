const mysql = require('mysql');

class Connection {
  connect(config, callback) {
    this.connection = mysql.createConnection(config);

    this.connection.connect(err => {
      console.log(`Connedted to ${config.database}...`);

      if (err)
        throw new Error('Error connecting: ' + err.stack);
  
      callback();
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

  insert(tableName, values) {
    const promise = new Promise((resolve, reject) => {
      this.connection.query('INSERT INTO ' + tableName + ' SET ?', values, (error, results, fields) => {
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

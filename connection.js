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

  async selectMany(sql) {
    console.log(sql);

    const { results } = await this.query(sql);

    return results;
  }
  
  async selectSingle(table, id) {
    const sql = `SELECT * FROM ${table} WHERE Id = ${id}`;
    console.log(sql);

    const { results } = await this.query(sql);
    
    if (results.length === 0)
      return null;

    return results[0];
  }
  
  async insert(table, body) {
    const sql = `INSERT INTO ${table} SET ?`;
    console.log(sql);

    const { results } = await this.queryValues(sql, body);
    
    return this.selectSingle(table, results.insertId);
  }
  
  async update(table, id, body) {
    let values = [];
  
    let sql = `UPDATE ${table} `;
    let index = 0;
  
    for (const key in body) {
      if (index === 0)
        sql += 'SET';
      else
        sql += ',';

      sql += ` ${key} = ? `;
      values.push(body[key]);

      index++;
    }
  
    sql += 'WHERE id = ?';
    values.push(id);

    console.log(sql);

    const { results } = await this.queryValues(sql, values);

    if (results.affectedRows === 0)
      return null;

    return this.selectSingle(table, id);
  }
  
  async delete(table, id) {
    const sql = `DELETE FROM ${table} WHERE Id = ?`;
    console.log(sql);

    const row = this.selectSingle(table, id);

    if (!row)
      return null;

    const { results } = await this.queryValues(sql, id);

    if (results.affectedRows === 0)
      return null;

    return row;
  }
  
  async deleteAll(table) {
    return await this.query(`DELETE FROM ${table}`);
  }
}

const connection = new Connection();

module.exports = connection;

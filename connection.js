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

  async selectMany(sql) {
    const { results } = await this.query(sql);
    
    return results;
  }
  
  async selectSingle(table, id) {
    const { results } = await this.query(`SELECT * FROM ${table} WHERE id = ${id}`);
    
    if (results.length === 0)
      return null;
      
    return results[0];
  }
  
  async insert(table, body) {
    const { results } = await this.queryValues(`INSERT INTO ${table} SET ?`, body);
    
    return { id: results.insertId, ...body }
  }
  
  async update(table, id, body) {
    let values = [];
  
    let sql = `UPDATE ${table} `;
  
    for (const key in body) {
      sql += `SET ${key} = ? `;
      values.push(body[key]);
    }
  
    sql += 'WHERE id = ?';
    values.push(id);
  
    const { results } = await this.queryValues(sql, values);

    if (results.affectedRows === 0)
      return null;

    return { ...body };
  }
  
  async delete(table, id) {
    const { results } = await this.queryValues(`DELETE FROM ${table} WHERE id = ?`, id);

    if (results.affectedRows === 0)
      return null;

    return results;
  }
  
  async deleteAll(table) {
    return await this.query(`DELETE FROM ${table}`);
  }
}

const connection = new Connection();

module.exports = connection;

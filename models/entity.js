class Field {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }

  sqlName() {
    return this.name;
  }

  objName() {
    return this.name.charAt(0).toLowerCase() + this.name.slice(1);;
  }
}


class Entity {
  constructor(connection) {
    this.connection = connection;

    this.fields = [];
  }

  tableName() {
    return this.constructor.name;
  }

  addField(name, params = {}) {
    const field = new Field(name, params);

    this.fields.push(field);
  }

  toObj(row) {
    const obj = {};

    for (const field of this.fields) {
      const value = row[field.sqlName()];

      if (value)
        obj[field.objName()] = value;
    }

    return obj;
  }
  
  toSql(obj) {
    const sql = {};

    for (const field of this.fields) {
      const value = obj[field.objName()];

      if (value)
        sql[field.sqlName()] = value;
    }

    return sql;
  }

  validate(obj) {
    for (const field of this.fields) {
      const value = obj[field.objName()];

      if (field.params.required && !value)
        return { message: 'Name is required.' }

      if (field.params.minLength && value.length < field.params.minLength)
        return { message: `Name length have to be at least ${field.params.minLength} characters.` }

      if (field.params.maxLength && value.length > field.params.maxLength)
        return { message: `Name length have to be less than ${field.params.maxLength} characters.` }
    }

    return null
  }

  async findById(id) {
    const { results } = await connection.query(`SELECT * FROM ${this.tableName()} WHERE Id = ` + id);

    if (results.length > 0)
      return results[0];
  
    return null;
  }


  //
  // SQL
  //
  
  async selectMany(sql) {
    console.log(sql);

    const { results } = await this.connection.query(sql);

    return results.map(row => this.toObj(row));
  }
  
  async selectSingle(table, id) {
    const sql = `SELECT * FROM ${table} WHERE Id = ${id}`;
    console.log(sql);

    const { results } = await this.connection.query(sql);
    
    if (results.length === 0)
      return null;

    return this.toObj(results[0]);
  }
  
  async insert(table, body) {
    body = this.toSql(body);

    const sql = `INSERT INTO ${table} SET ?`;
    console.log(sql);

    const { results } = await this.connection.queryValues(sql, body);
    
    return await this.selectSingle(table, results.insertId);
  }
  
  async update(table, id, body) {
    body = this.toSql(body);

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

    const { results } = await this.connection.queryValues(sql, values);

    if (results.affectedRows === 0)
      return null;

    return await this.selectSingle(table, id);
  }
  
  async delete(table, id) {
    const sql = `DELETE FROM ${table} WHERE Id = ?`;
    console.log(sql);

    const row = await this.selectSingle(table, id);

    if (!row)
      return null;

    const { results } = await this.connection.queryValues(sql, id);

    if (results.affectedRows === 0)
      return null;

    return row;
  }
  
  async deleteAll(table) {
    return await this.connection.query(`DELETE FROM ${table}`);
  }


  //
  // REST
  //

  notFoundMessage(id) {
    return `The ${this.tableName()} with ID = ${id} was not found.`;
  }

  async restGet(req, res, next) {
    try {
      const rows = await this.selectMany(`SELECT * FROM ${this.tableName()} ORDER BY Id`);
  
      res.send(rows);
    }
    catch (ex) {
      next(ex);
    }
  }

  async restGetId(req, res, next) {
    try {
      const id = parseInt(req.params.id);
  
      const row = await this.selectSingle(this.tableName(), id);
    
      if (!row)
        return res.status(404).send(this.notFoundMessage(id));
          
      res.send(row);
    }
    catch (ex) {
      next(ex);
    }
  }

  async restPost(req, res, next) {
    try {
      const error = this.validate(req.body);
  
      if (error)
        return res.status(400).send(error.message);
  
      const row = await this.insert(this.tableName(), req.body);
  
      res.status(201).send(row);
    }
    catch (ex) {
      next(ex);
    }
  }

  async restPatch(req, res, next) {
    try {
      const id = parseInt(req.params.id);
  
      const error = this.validate(req.body);
  
      if (error)
        return res.status(400).send(error.message);
  
      const row = await this.update(this.tableName(), id, req.body);
    
      if (!row)
        return res.status(404).send(this.notFoundMessage(id));
    
      res.send(row);
    }
    catch (ex) {
      next(ex);
    }
  }

  async restDelete(req, res, next) {
    try {
      const id = parseInt(req.params.id);
  
      const row = await this.delete(this.tableName(), id);
    
      if (!row)
        return res.status(404).send(this.notFoundMessage(id));
          
      res.send(row);
    }
    catch (ex) {
      next(ex);
    }
  }
}  

module.exports = Entity;
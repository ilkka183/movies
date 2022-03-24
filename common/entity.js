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
    const { results } = await this.connection.query(`SELECT * FROM ${this.tableName()} WHERE Id = ` + id);

    if (results.length > 0)
      return results[0];
  
    return null;
  }


  //
  // SQL Commands
  //

  async selectMany(sql) {
    const rows = await this.connection.selectMany(sql);

    return rows.map(row => this.toObj(row));
  }
  
  async selectSingle(table, id) {
    const row = await this.connection.selectSingle(table, id);
    
    if (row)
      return this.toObj(row);

    return null;
  }
  
  async insert(table, body) {
    const results = await this.connection.insert(table, this.toSql(body));
    
    return await this.selectSingle(table, results.insertId);
  }
  
  async update(table, id, body) {
    const results = await this.connection.update(table, id, this.toSql(body));

    if (results.affectedRows === 0)
      return null;

    return await this.selectSingle(table, id);
  }
  
  async delete(table, id) {
    const row = this.selectSingle(table, id);
    const results = await this.connection.delete(table, id);

    if (results.affectedRows === 0)
      return null;

    return row;
  }


  //
  // REST Methods
  //

  notFoundMessage(id) {
    return `The ${this.tableName()} with ID = ${id} was not found.`;
  }

  async processGetAll(req, res, next) {
    try {
      const rows = await this.selectMany(`SELECT * FROM ${this.tableName()} ORDER BY Id`);
  
      res.send(rows);
    }
    catch (ex) {
      next(ex);
    }
  }

  async processGetById(req, res, next) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id))
        return res.status(404).send('Invalid ID.');
    
      const row = await this.selectSingle(this.tableName(), id);
    
      if (!row)
        return res.status(404).send(this.notFoundMessage(id));
          
      res.send(row);
    }
    catch (ex) {
      next(ex);
    }
  }

  async processPost(req, res, next) {
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

  async processPatch(req, res, next) {
    try {
      const id = parseInt(req.params.id);
  
      if (isNaN(id))
        return res.status(404).send('Invalid ID.');

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

  async processDelete(req, res, next) {
    try {
      const id = parseInt(req.params.id);
  
      if (isNaN(id))
        return res.status(404).send('Invalid ID.');
        
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

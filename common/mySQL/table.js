class Field {
  constructor(name, options) {
    this.name = name;
    this.options = options;
  }

  sqlName() {
    return this.name;
  }

  objName() {
    return this.name.charAt(0).toLowerCase() + this.name.slice(1);;
  }

  minLength() {
    return this.options.minLength;
  }

  maxLength() {
    return this.options.maxLength;
  }

  minValue() {
    return this.options.minValue;
  }

  maxValue() {
    return this.options.maxValue;
  }

  required() {
    return this.options.required;
  }
}


class Table {
  constructor(db) {
    this.db = db;

    this.fields = [];
  }

  tableName() {
    return this.constructor.name;
  }

  addField(name, options = {}) {
    const field = new Field(name, options);

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

  message(message) {
    return { message }
  }

  validate(obj) {
    for (const field of this.fields) {
      const value = obj[field.objName()];

      if (field.required() && !value)
        return this.message(`Field ${field.name} is required.`);

      if (field.minLength() && (value.length < field.minLength()))
        return this.message(`Field ${field.name} length have to be at least ${field.minLength()} characters.`);

      if (field.maxLength() && (value.length > field.maxLength()))
        return this.message(`Field ${field.name} length have to be less than ${field.maxLength()} characters.`);

      if (field.minValue() && (parseInt(value) < field.minValue()))
        return this.message(`Field ${field.name} minumum value is ${field.minValue()}.`);

      if (field.maxValue() && (parseInt(value) > field.maxValue()))
        return this.message(`Field ${field.name} maximun value is ${field.maxValue()}.`); 
    }

    return null
  }

  async findById(id) {
    const { results } = await this.db.query(`SELECT * FROM ${this.tableName()} WHERE Id = ${id}`);

    if (results.length > 0)
      return results[0];
  
    return null;
  }


  //
  // SQL Commands
  //

  async selectMany(sql) {
    const rows = await this.db.selectMany(sql);

    return rows.map(row => this.toObj(row));
  }
  
  async selectSingle(id) {
    const row = await this.db.selectSingle(this.tableName(), id);
    
    if (row)
      return this.toObj(row);

    return null;
  }
  
  async insert(body) {
    const results = await this.db.insert(this.tableName(), this.toSql(body));
    
    return await this.selectSingle(results.insertId);
  }
  
  async update(id, body) {
    const results = await this.db.update(this.tableName(), id, this.toSql(body));

    if (results.affectedRows === 0)
      return null;

    return await this.selectSingle(id);
  }
  
  async delete(id) {
    const row = this.selectSingle(id);
    const results = await this.db.delete(this.tableName(), id);

    if (results.affectedRows === 0)
      return null;

    return row;
  }

  async deleteAll() {
    await this.db.deleteAll(this.tableName());
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
    
      const row = await this.selectSingle(id);
    
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
  
      const row = await this.insert(req.body);
  
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
  
      const row = await this.update(id, req.body);
    
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
        
      const row = await this.delete(id);
    
      if (!row)
        return res.status(404).send(this.notFoundMessage(id));
          
      res.send(row);
    }
    catch (ex) {
      next(ex);
    }
  }
}  

module.exports = Table;

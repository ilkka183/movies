const Entity = require('./entity');

class Customer extends Entity {
  constructor(db) {
    super(db);

    this.addNumberField('Id', { autoIncrement: true });
    this.addStringField('Name', { required: true, minLength: 5, maxLength: 50 });
  }
}

module.exports = Customer;

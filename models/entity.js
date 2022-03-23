class Entity {
  static notFoundMessage(id) {
    return `The ${Entity.name} with ID = ${id} was not found.`;
  }
}  

module.exports = Entity;
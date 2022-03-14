const connection = require('../../connection');

async function insert(table, body) {
  const { results } = await connection.queryValues('INSERT INTO ' + table + ' SET ?', body);

  return results.insertId;
}

async function deleteAll(table) {
  await connection.query('DELETE FROM ' + table);
}

module.exports = {
  insert,
  deleteAll
}
const connection = require('../../connection');

async function insert(table, body) {
  const { results } = await connection.queryValues('INSERT INTO ' + table + ' SET ?', body);

  return { id: results.insertId, ...body }
}

async function update(table, id, body) {
  let values = [];

  let sql = 'UPDATE ' + table + ' ';

  for (const key in body) {
    sql += 'SET ' + key + ' = ? '
    values.push(body[key]);
  }

  sql += 'WHERE id = ?'
  values.push(id);

  const { results } = await connection.queryValues(sql, values);

  return { id: results.insertId, ...body }
}

async function deleteAll(table) {
  await connection.query('DELETE FROM ' + table);
}

module.exports = {
  insert,
  update,
  deleteAll
}
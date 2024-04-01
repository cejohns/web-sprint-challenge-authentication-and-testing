const db = require('../../data/dbConfig'); // Assuming your database configuration file path

// find function
function find() {
  return db('users').select('user_id', 'username');
}

// findBy function
function findBy(filter) {
  return db('users').where(filter).select('user_id', 'username');
}

// findById function
function findById(user_id) {
  return db('users').where({ user_id }).first();
}

// add function
async function add(user) {
  const [newUser] = await db('users').insert(user, ['user_id', 'username', 'password']);
  return newUser;
}

module.exports = {
  find,
  findBy,
  findById,
  add,
};

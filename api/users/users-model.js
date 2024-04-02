const db = require('../../data/dbConfig'); // Assuming your database configuration file path

// find function
function findAll() {
  return db('users')
}

// findBy function
// function findBy(filter) {
//   return db('users').where(filter, )
// }

// findById function
function findById(id) {
  return db('users').where( 'id',id ).first();
}

// add function
async function add(user) {
  // const newUser = await db('users').insert(user, [ 'username', 'password']);
  // return newUser;
  const [id] = await db('users').insert(user);
  return db('users').where({id}).first();
}

module.exports = {
  findAll,
  findById,
  add,
};

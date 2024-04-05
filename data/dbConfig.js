// do not make changes to this file
const knex = require('knex');
const knexConfig = require('../knexfile.js');
const environment = process.env.NODE_ENV || 'development';

// Log the current environment
console.log("Environment:", environment);

// Log the Knex configuration for the current environment
console.log("Knex Config for Environment:", knexConfig[environment]);

module.exports = knex(knexConfig[environment]);

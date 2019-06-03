const dbConfig = require('../knexfile');

module.exports = require('knex')(dbConfig);

const knex = require('knex')
const config = require('../../config/postgresConfig')

module.exports = knex(config.database)
const server = require('./infra/api/server')
const mongo = require('./infra/config/mongoConfig')
const postgres = require('./infra/config/postgresConfig')

server.start(postgres)

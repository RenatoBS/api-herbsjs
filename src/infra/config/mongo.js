const env = require('sugar-env')
require('dotenv').config()


module.exports = {
  herbsCLI: 'mongo',
  dbName: env.get(`$MONGO_DATABASE`, 'api-herbs'),
  connstr: env.get(`$MONGO_CONN_STR`, 'mongodb://root:example@localhost:27017'),
}

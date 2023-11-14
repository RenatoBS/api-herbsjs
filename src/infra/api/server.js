const express = require('express')
const { herbsshelf } = require('@herbsjs/herbsshelf')
const { herbarium } = require('@herbsjs/herbarium')
const { consumeMessages } = require('../job/consume')

const { auth } = require('./auth')

const { rest } = require('./rest')

consumeMessages().catch((err) => console.error(err));

function shelf(app, config) {

  app.get('/herbsshelf', (_, res) => {
    res.setHeader('Content-Type', 'text/html')
    const shelf = herbsshelf({ project: 'api-herbs', herbarium })
    res.write(shelf)
    res.end()
  })

  app.get("/", (req, res) => res.status(301).redirect("/herbsshelf"))

  // eslint-disable-next-line no-console
  console.info(`\n🌿 Herbs Shelf endpoint - /herbsshelf \n`)
}

async function start(config) {

  herbarium.requireAll()

  const app = express()
  await auth(app, config)
  await rest(app, config)

  await shelf(app, config)

  return app.listen(
    { port: config.api.port },
    // eslint-disable-next-line no-console
    () => console.info(`🚀 Server UP and 🌪️  - http://localhost:${config.api.port}/`))
}

module.exports = { start }




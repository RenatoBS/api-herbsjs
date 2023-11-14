const { usecase, step, Ok } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Operation = require('../../entities/operation')
const OperationRepository = require('../../../infra/data/repositories/operationRepository')

const dependency = { OperationRepository }

const findAllOperation = injection =>
  usecase('Find all Operations', {
    // Input/Request metadata and validation
    request: {
      limit: Number,
      offset: Number
    },

    // Output/Response metadata
    response: [Operation],

    //Authorization with Audit
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Find and return all the Operations': step(async ctx => {
        const repo = new ctx.di.OperationRepository(injection)
        const operations = await repo.findAll(ctx.req)
        // ctx.ret is the return value of a use case
        return Ok(ctx.ret = operations)
    })
  })

module.exports =
  herbarium.usecases
    .add(findAllOperation, 'FindAllOperation')
    .metadata({ group: 'Operation', operation: herbarium.crud.readAll, entity: Operation })
    .usecase

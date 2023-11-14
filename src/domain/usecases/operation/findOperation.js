const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Operation = require('../../entities/operation')
const OperationRepository = require('../../../infra/data/repositories/operationRepository')

const dependency = { OperationRepository }

const findOperation = injection =>
  usecase('Find a Operation', {
    // Input/Request metadata and validation 
    request: {
      id: String
    },

    // Output/Response metadata
    response: Operation,

    //Authorization with Audit
    // authorize: (user) => (user.canFindOneOperation ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Find and return the Operation': step(async ctx => {
      const id = ctx.req.id
      const repo = new ctx.di.OperationRepository(injection)
      const [operation] = await repo.findByID(id)
      if (!operation) return Err.notFound({ 
        message: `Operation entity not found by ID: ${id}`,
        payload: { entity: 'Operation', id }
      })
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret = operation)
    })
  })

module.exports =
  herbarium.usecases
    .add(findOperation, 'FindOperation')
    .metadata({ group: 'Operation', operation: herbarium.crud.read, entity: Operation })
    .usecase
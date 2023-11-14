const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Operation = require('../../entities/operation')
const OperationRepository = require('../../../infra/data/repositories/operationRepository')

const dependency = { OperationRepository }

const deleteOperation = injection =>
  usecase('Delete Operation', {
    // Input/Request metadata and validation 
    request: {
      id: String
    },

    // Output/Response metadata
    response: Boolean,

    //Authorization with Audit
    // authorize: (user) => (user.canDeleteOperation ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Check if the Operation exist': step(async ctx => {
      const repo = new ctx.di.OperationRepository(injection)
      const [operation] = await repo.findByID(ctx.req.id)
      ctx.operation = operation

      if (operation) return Ok()
      return Err.notFound({
          message: `Operation ID ${ctx.req.id} does not exist`,
          payload: { entity: 'Operation' }
      })
    }),

    'Delete the Operation': step(async ctx => {
      const repo = new ctx.di.OperationRepository(injection)
      ctx.ret = await repo.delete(ctx.operation)
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret)
    })
  })

module.exports =
  herbarium.usecases
    .add(deleteOperation, 'DeleteOperation')
    .metadata({ group: 'Operation', operation: herbarium.crud.delete, entity: Operation })
    .usecase
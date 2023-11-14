const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const merge = require('deepmerge')
const Operation = require('../../entities/operation')
const OperationRepository = require('../../../infra/data/repositories/operationRepository')

const dependency = { OperationRepository }

const updateOperation = injection =>
  usecase('Update Operation', {
    // Input/Request metadata and validation 
    request: request.from(Operation),

    // Output/Response metadata
    response: Operation,

    //Authorization with Audit
    // authorize: (user) => (user.canUpdateOperation ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Retrieve the Operation': step(async ctx => {
      const id = ctx.req.id
      const repo = new ctx.di.OperationRepository(injection)
      const [operation] = await repo.findByID(id)
      ctx.operation = operation
      if (operation === undefined) return Err.notFound({
        message: `Operation not found - ID: ${id}`,
        payload: { entity: 'Operation' }
      })

      return Ok(operation)
    }),

    'Check if it is a valid Operation before update': step(ctx => {
      const oldOperation = ctx.operation
      const newOperation = Operation.fromJSON(merge.all([ oldOperation, ctx.req ]))
      ctx.operation = newOperation

      return newOperation.isValid() ? Ok() : Err.invalidEntity({
        message: `Operation is invalid`,
        payload: { entity: 'Operation' },
        cause: newOperation.errors
      })

    }),

    'Update the Operation': step(async ctx => {
      const repo = new ctx.di.OperationRepository(injection)
      // ctx.ret is the return value of a use case
      return (ctx.ret = await repo.update(ctx.operation))
    })

  })

module.exports =
  herbarium.usecases
    .add(updateOperation, 'UpdateOperation')
    .metadata({ group: 'Operation', operation: herbarium.crud.update, entity: Operation })
    .usecase
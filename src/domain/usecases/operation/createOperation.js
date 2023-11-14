const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const { v4: uuidv4 } = require('uuid');
const Operation = require('../../entities/operation')
const OperationRepository = require('../../../infra/data/repositories/operationRepository')
const { publishToQueue } = require('../../../infra/job/publish')

const dependency = { OperationRepository }

const createOperation = injection =>
  usecase('Create Operation', {
    request: request.from(Operation, { ignoreIDs: true }),

    response: Operation,

    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Check if the Operation is valid': step(ctx => {
      ctx.operation = Operation.fromJSON(ctx.req)
      ctx.operation.id = uuidv4()

      if (!ctx.operation.isValid())
        return Err.invalidEntity({
          message: 'The Operation entity is invalid',
          payload: { entity: 'Operation' },
          cause: ctx.operation.errors
        })
      return Ok()
    }),

    'Save the Operation': step(async ctx => {
      const repo = new ctx.di.OperationRepository(injection)
      const operation = ctx.operation
      await publishToQueue(operation)
      return (ctx.ret = await repo.insert(operation))
    })
  })

module.exports =
  herbarium.usecases
    .add(createOperation, 'CreateOperation')
    .metadata({ group: 'Operation', operation: herbarium.crud.create, entity: Operation })
    .usecase
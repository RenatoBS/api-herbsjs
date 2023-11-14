const createOperation = require('./createOperation')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const createOperationSpec = spec({

  usecase: createOperation,

  'Create a new operation when it is valid': scenario({
    'Given a valid operation': given({
      request: {
        type: 'buy',
        asset: 'a text',
        quantity: 99,
        price: 10.50
      },
      user: { hasAccess: true },
      injection: {
        OperationRepository: class OperationRepository {
          async insert(operation) { return (operation) }
        }
      },
    }),


    'Must run without errors': check((ctx) => {
      assert.ok(ctx.response.isOk)
    }),

    'Must return a valid operation': check((ctx) => {
      assert.strictEqual(ctx.response.ok.isValid(), true)
    })

  }),

  'Do not create a new operation when it is invalid': scenario({
    'Given a invalid operation': given({
      request: {
        type: true,
        asset: true,
        quantity: true,
        price: true,
      },
      user: { hasAccess: true },
      injection: {
        operationRepository: new (class OperationRepository {
          async insert(operation) { return (operation) }
        })
      },
    }),


    'Must return an error': check((ctx) => {
      assert.ok(ctx.response.isErr)
    }),

  }),
})

module.exports =
  herbarium.specs
    .add(createOperationSpec, 'CreateOperationSpec')
    .metadata({ usecase: 'CreateOperation' })
    .spec
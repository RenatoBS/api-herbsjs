const Operation = require('../../entities/operation')
const findOperation = require('./findOperation')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findOperationSpec = spec({

  usecase: findOperation,

  'Find a operation when it exists': scenario({
    'Given an existing operation': given({
      request: {
        id: 'a text'
      },
      user: { hasAccess: true },
      injection: {
        OperationRepository: class OperationRepository {
          async findByID(id) {
            const fakeOperation = {
              id: 'a text',
              type: 'buy',
              asset: 'a text',
              quantity: 99,
              price: 10.5
            }
            return ([Operation.fromJSON(fakeOperation)])
          }
        }
      },
    }),

    // when: default when for use case

    'Must run without errors': check((ctx) => {
      assert.ok(ctx.response.isOk)
    }),

    'Must return a valid operation': check((ctx) => {
      assert.strictEqual(ctx.response.ok.isValid(), true)
    })

  }),

  'Do not find a operation when it does not exist': scenario({
    'Given an empty operation repository': given({
      request: {
        id: 'a text'
      },
      user: { hasAccess: true },
      injection: {
        OperationRepository: class OperationRepository {
          async findByID(id) { return [] }
        }
      },
    }),

    // when: default when for use case

    'Must return an error': check((ctx) => {
      assert.ok(ctx.response.isErr)
      assert.ok(ctx.response.isNotFoundError)
    }),
  }),
})

module.exports =
  herbarium.specs
    .add(findOperationSpec, 'FindOperationSpec')
    .metadata({ usecase: 'FindOperation' })
    .spec
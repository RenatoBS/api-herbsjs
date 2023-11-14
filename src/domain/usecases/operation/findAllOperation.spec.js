const Operation = require('../../entities/operation')
const findAllOperation = require('./findAllOperation')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findAllOperationSpec = spec({

    usecase: findAllOperation,
  
    'Find all operations': scenario({
      'Given an existing operation': given({
        request: { limit: 0, offset: 0 },
        user: { hasAccess: true },
        injection: {
            OperationRepository: class OperationRepository {
              async findAll(id) { 
                  const fakeOperation = {
                    id: 'a text',
        type: 'a text',
        asset: 'a text',
        quantity: 99
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

      'Must return a list of operations': check((ctx) => {
        assert.strictEqual(ctx.response.ok.length, 1)
      })

    }),

  })
  
module.exports =
  herbarium.specs
    .add(findAllOperationSpec, 'FindAllOperationSpec')
    .metadata({ usecase: 'FindAllOperation' })
    .spec
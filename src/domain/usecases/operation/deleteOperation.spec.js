const Operation = require('../../entities/operation')
const deleteOperation = require('./deleteOperation')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const deleteOperationSpec = spec({

    usecase: deleteOperation,
  
    'Delete operation if exists': scenario({
      'Given an existing operation': given({
        request: {
            id: 'a text'
        },
        user: { hasAccess: true },
        injection:{
            OperationRepository: class OperationRepository {
                async delete(entity) { return true }
                async findByID(id) { return [Operation.fromJSON({ id })] }            }
        },
      }),

      // when: default when for use case

      'Must run without errors': check((ctx) => {
        assert.ok(ctx.response.isOk)  
      }),

      'Must confirm deletion': check((ctx) => {
        assert.ok(ctx.response.ok === true)
      })

    }),

    'Do not delete operation if it does not exist': scenario({
        'Given an empty operation repository': given({
          request: {
              id: 'a text'
          },
          user: { hasAccess: true },
          injection:{
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
    .add(deleteOperationSpec, 'DeleteOperationSpec')
    .metadata({ usecase: 'DeleteOperation' })
    .spec
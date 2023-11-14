const Operation = require('../../entities/operation')
const updateOperation = require('./updateOperation')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const updateOperationSpec = spec({

    usecase: updateOperation,
    'Update a existing operation when it is valid': scenario({

      'Valid operations': samples([
        {
          id: 'a text',
          type: 'buy',
          asset: 'a text',
          quantity: 99,
          price: 10.50
        },
        {
          id: 'a text',
          type: 'buy',
          asset: 'a text',
          quantity: 99,
          price: 10.50
        }
      ]),
      
      'Valid operations Alternative': samples([
        {
          id: 'a text',
          type: 'buy',
          asset: 'a text',
          quantity: 99,
          price: 10.50
        },
        {
          id: 'a text',
          type: 'buy',
          asset: 'a text',
          quantity: 99,
          price: 10.50
        }
      ]),

      'Given a valid operation': given((ctx) => ({
        request: ctx.sample,
        user: { hasAccess: true }
      })),

      'Given a repository with a existing operation': given((ctx) => ({
        injection: {
            OperationRepository: class OperationRepository {
              async findByID(id) { 
                const fakeOperation = {
                    id: 'a text',
                    type: 'buy',
                    asset: 'a text',
                    quantity: 99,
                    price: 10.50
                }
                return ([Operation.fromJSON(fakeOperation)])              }
              async update(id) { return true }
            }
          },
      })),

      // when: default when for use case

      'Must run without errors': check((ctx) => {
        assert.ok(ctx.response.isOk)  
      }),

      'Must confirm update': check((ctx) => {
        assert.ok(ctx.response.ok === true)
      })

    }),

    'Do not update a operation when it is invalid': scenario({
      'Given a invalid operation': given({
        request: {
          id: true,
        type: true,
        asset: true,
        quantity: true,
        price: true
        },
        user: { hasAccess: true },
        injection: {},
      }),

      // when: default when for use case

      'Must return an error': check((ctx) => {
        assert.ok(ctx.response.isErr)  
        // assert.ok(ctx.response.isInvalidEntityError)
      }),

    }),

    'Do not update operation if it does not exist': scenario({
        'Given an empty operation repository': given({
          request: {
              id: 'a text',
              type: 'buy',
              asset: 'a text',
              quantity: 99,
              price: 10.50
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
    .add(updateOperationSpec, 'UpdateOperationSpec')
    .metadata({ usecase: 'UpdateOperation' })
    .spec
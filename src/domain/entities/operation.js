const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

const Operation =
  entity('Operation', {
    id: id(String),
    type: field(String, {
      validation: {
        presence: true,
        contains: {
          allowed: ["buy", "sell"]
        },
      }
    }),
    asset: field(String),
    quantity: field(Number, {
      validation: {
        presence: true,
        numericality: {
          greaterThan: 0,
          onlyInteger: true
        }
      }
    }),
    price: field(Number, {
      validation: {
        presence: true,
        numericality: {
          greaterThanOrEqualTo: 0,
        }
      }
    }),
  })

module.exports =
  herbarium.entities
    .add(Operation, 'Operation')
    .entity

const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

const User =
  entity('User', {
    id: id(String),
    name: field(String),
    email: field(String, { validation: { presence: true, email: true } }),
    password: field(String, { validation: { presence: true, length: { minimum: 4 } } })
  })

module.exports =
  herbarium.entities
    .add(User, 'User')
    .entity


exports.up = async function (knex) {
    knex.schema.hasTable('operations')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('operations', function (table) {
                    table.string('id').primary()
                    table.string('type')
                    table.string('asset')
                    table.integer('quantity')
                    table.decimal('price')
                    table.timestamps()
                })
        })
}

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('operations')
}

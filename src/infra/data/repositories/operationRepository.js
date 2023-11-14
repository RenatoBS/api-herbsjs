const { Repository } = require("@herbsjs/herbs2knex")
const { herbarium } = require('@herbsjs/herbarium')
const Operation = require('../../../domain/entities/operation')
const connection = require('../database/pg')

class OperationRepository extends Repository {
    constructor(injection) {
        super({
            entity: Operation,
            table: "operations",
            knex: connection
        })
    }
}

module.exports =
    herbarium.repositories
        .add(OperationRepository, 'OperationRepository')
        .metadata({ entity: Operation })
        .repository
'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DepartamentoSchema extends Schema {
  up () {
    this.create('departamentos', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('abbreviation').notNullable().unique() //sigla
      table.boolean('active').defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('departamentos')
  }
}

module.exports = DepartamentoSchema

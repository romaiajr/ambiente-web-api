'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProblemaSchema extends Schema {
  up () {
    this.create('problemas', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('description').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('problemas')
  }
}

module.exports = ProblemaSchema

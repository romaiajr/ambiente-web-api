'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProblemaSchema extends Schema {
  up () {
    this.create('problemas', (table) => {
      table.increments()
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.boolean('active').defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('problemas')
  }
}

module.exports = ProblemaSchema

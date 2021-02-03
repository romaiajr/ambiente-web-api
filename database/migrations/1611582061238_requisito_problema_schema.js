'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RequisitoProblemaSchema extends Schema {
  up () {
    this.create('requisito_problemas', (table) => {
      table.increments()
      table.integer('problema_id').unsigned().references('id').inTable('problemas').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('requisito_problemas')
  }
}

module.exports = RequisitoProblemaSchema

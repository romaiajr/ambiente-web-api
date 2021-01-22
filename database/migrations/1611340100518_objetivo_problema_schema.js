'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ObjetivoProblemaSchema extends Schema {
  up () {
    this.create('objetivo_problemas', (table) => {
      table.increments()
      table.integer('problema_id').unsigned().references('id').inTable('problemas').onUpdate('CASCADE').notNullable()
      table.string('name').notNullable()
      table.string('description').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('objetivo_problemas')
  }
}

module.exports = ObjetivoProblemaSchema

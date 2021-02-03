'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ObjetivoProblemaSchema extends Schema {
  up () {
    this.create('objetivo_problemas', (table) => {
      table.increments()
      table.integer('problema_id').unsigned().references('id').inTable('problemas').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('objetivo_problemas')
  }
}

module.exports = ObjetivoProblemaSchema

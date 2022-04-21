'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AvaliacaoProblemaSchema extends Schema {
  up () {
    this.create('avaliacao_problemas', (table) => {
      table.increments()
      table.integer('problema_id').unsigned().references('id').inTable('problemas').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.integer('feedback').notNullable() // avaliação
      table.timestamps()
    })
  }

  down () {
    this.drop('avaliacao_problemas')
  }
}

module.exports = AvaliacaoProblemaSchema

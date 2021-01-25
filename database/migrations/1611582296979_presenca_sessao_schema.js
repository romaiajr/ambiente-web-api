'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PresencaSessaoSchema extends Schema {
  up () {
    this.create('presenca_sessaos', (table) => {
      table.increments()
      table.integer('sessao_id').unsigned().references('id').inTable('sessao_pbls').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.integer('aluno_id').unsigned().references('id').inTable('alunos').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.boolean('wasPresent').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('presenca_sessaos')
  }
}

module.exports = PresencaSessaoSchema

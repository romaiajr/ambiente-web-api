'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TurmaAlunoSchema extends Schema {
  up () {
    this.create('turma_alunos', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.integer('turma_id').unsigned().references('id').inTable('turmas').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('turma_alunos')
  }
}

module.exports = TurmaAlunoSchema

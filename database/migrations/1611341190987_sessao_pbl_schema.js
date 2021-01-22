'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SessaoPblSchema extends Schema {
  up () {
    this.create('sessao_pbls', (table) => {
      table.increments()
      table.integer('turma_id').unsigned().references('id').inTable('turmas').onUpdate('CASCADE').notNullable() 
      table.date('date').notNullable()     
      table.timestamps()
    })
  }

  down () {
    this.drop('sessao_pbls')
  }
}

module.exports = SessaoPblSchema

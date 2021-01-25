'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TurmaSchema extends Schema {
  up () {
    this.create('turmas', (table) => {
      table.increments()
      table.integer('disciplina_id').unsigned().references('id').inTable('disciplina_ofertadas').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.integer('tutor_id').unsigned().references('id').inTable('tutors').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('turmas')
  }
}

module.exports = TurmaSchema

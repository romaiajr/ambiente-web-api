'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TurmaTutorSchema extends Schema {
  up () {
    this.create('turma_tutors', (table) => {
      table.increments()
      table.integer('tutor_id').unsigned().references('id').inTable('tutors').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.integer('turma_id').unsigned().references('id').inTable('turmas').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('turma_tutors')
  }
}

module.exports = TurmaTutorSchema

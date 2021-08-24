'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DisciplinaOfertadaSchema extends Schema {
  up () {
    this.create('disciplina_ofertadas', (table) => {
      table.increments()
      table.integer('disciplina_id').unsigned().references('id').inTable('disciplinas').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.integer('semestre_id').unsigned().references('id').inTable('semestres').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.integer('number_of_classes').notNullable()
      table.string('folder_id').notNullable()
      table.boolean('active').defaultTo(true);
      table.timestamps()
    })
  }

  down () {
    this.drop('disciplina_ofertadas')
  }
}

module.exports = DisciplinaOfertadaSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DisciplinaSchema extends Schema {
  up () {
    this.create('disciplinas', (table) => {
      table.increments()
      table.string('code').notNullable().unique()
      table.string('name').notNullable()
      table.integer('workload').notNullable() //Carga Horária da Disciplina
      table.integer('departamento_id').unsigned().references('id').inTable('departamentos').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.string('folder_id').notNullable()
      table.boolean('active').defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('disciplinas')
  }
}

module.exports = DisciplinaSchema

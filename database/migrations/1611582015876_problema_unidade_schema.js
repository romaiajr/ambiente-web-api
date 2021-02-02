'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProblemaUnidadeSchema extends Schema {
  up () {
    this.create('problema_unidades', (table) => {
      table.increments()
      table.integer('disciplina_ofertada_id').unsigned().references('id').inTable('disciplina_ofertadas').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.integer('problema_id').unsigned().references('id').inTable('problemas').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('problema_unidades')
  }
}

module.exports = ProblemaUnidadeSchema

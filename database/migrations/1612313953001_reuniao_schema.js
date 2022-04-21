'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReuniaoSchema extends Schema {
  up () {
    this.create('reuniaos', (table) => {
      table.increments()
      table.integer('problema_id').unsigned().references('id').inTable('problemas').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      //relatório
      table.timestamps()
    })
  }

  down () {
    this.drop('reuniaos')
  }
}

module.exports = ReuniaoSchema

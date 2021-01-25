'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SemestreSchema extends Schema {
  up () {
    this.create('semestres', (table) => {
      table.increments()
      table.string('code').notNullable().unique()
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.boolean('active').defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('semestres')
  }
}

module.exports = SemestreSchema

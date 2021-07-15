'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaremaSchema extends Schema {
  up () {
    this.create('baremas', (table) => {
      table.increments()
      table.integer('tutor_id').unsigned().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.string('name').notNullable()
      table.string('active').defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('baremas')
  }
}

module.exports = BaremaSchema

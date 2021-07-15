'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ItemBaremaSchema extends Schema {
  up () {
    this.create('item_baremas', (table) => {
      table.increments()
      table.integer('barema_id').unsigned().references('id').inTable('baremas').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.integer('amount').notNullable()
      table.string('name').notNullable()
      table.string('active').defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('item_baremas')
  }
}

module.exports = ItemBaremaSchema

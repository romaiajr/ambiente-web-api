'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProdutoProblemaSchema extends Schema {
  up () {
    this.create('produto_problemas', (table) => {
      table.increments()
      table.integer('problema_id').unsigned().references('id').inTable('problemas').onUpdate('CASCADE').notNullable()
      table.string('item_name').notNullable() //nome do produto
      table.string('amount').notNullable() //peso
      table.timestamps()
    })
  }

  down () {
    this.drop('produto_problemas')
  }
}

module.exports = ProdutoProblemaSchema

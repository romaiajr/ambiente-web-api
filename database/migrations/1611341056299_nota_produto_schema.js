'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NotaProdutoSchema extends Schema {
  up () {
    this.create('nota_produtos', (table) => {
      table.increments()
      table.integer('produto_id').unsigned().references('id').inTable('produto_problemas').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.float('grade').notNullable() // nota
      table.timestamps()
    })
  }

  down () {
    this.drop('nota_produtos')
  }
}

module.exports = NotaProdutoSchema

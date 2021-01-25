'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdministradorSchema extends Schema {
  up () {
    this.create('administradores', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('administradores')
  }
}

module.exports = AdministradorSchema

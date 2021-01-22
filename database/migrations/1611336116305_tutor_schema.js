'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TutorSchema extends Schema {
  up () {
    this.create('tutores', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onUpdate('CASCADE').notNullable()
      table.boolean('isCoordenador').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('tutores')
  }
}

module.exports = TutorSchema

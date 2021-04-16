"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TurmaSchema extends Schema {
  up() {
    this.create('turmas', (table) => {
      table.increments()
      table.string('code').notNullable()
      table.integer('disciplina_id').unsigned().references('id').inTable('disciplina_ofertadas').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop("turmas");
  }
}

module.exports = TurmaSchema;

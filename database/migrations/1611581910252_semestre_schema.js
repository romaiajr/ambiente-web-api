"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SemestreSchema extends Schema {
  up() {
    this.create("semestres", (table) => {
      table.increments();
      table.string("code").notNullable().unique();
      table.string("start_date").notNullable(); //colocar string
      table.string("end_date").notNullable(); //colocar string
      table.boolean("active").defaultTo(true);
      table.timestamps();
    });
  }

  down() {
    this.drop("semestres");
  }
}

module.exports = SemestreSchema;

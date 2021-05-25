"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SystemLogSchema extends Schema {
  up() {
    this.create("system_logs", (table) => {
      table.increments();
      table.string("log").notNullable();
      table.timestamps({ useTz: true });
    });
  }

  down() {
    this.drop("system_logs");
  }
}

module.exports = SystemLogSchema;

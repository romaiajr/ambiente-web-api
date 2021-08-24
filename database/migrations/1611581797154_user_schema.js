"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", (table) => {
      table.increments();
      table.string("username").notNullable();
      table.string("password").notNullable();
      table.string("email").notNullable().unique();
      table.string("enrollment").notNullable(); //matricula
      table.integer("user_type").notNullable();
      table.string("first_name").notNullable();
      table.string("surname").notNullable();
      table.boolean("active").defaultTo(true);
      table.timestamps();
    });
  }
  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;

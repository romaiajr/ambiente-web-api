"use strict";

const User = use("App/Models/User");
const Aluno = use("App/Models/Aluno");
const Tutor = use("App/Models/Tutor");
const Adm = use("App/Models/Administrador");
const Database = use("Database");
const { validateAll, rule } = use("Validator");

class UserController {
  /**
   * Show a list of all users.
   * GET users
   * ANCHOR INDEX
   */
  async index({ request, response, auth }) {
    try {
      const users = await Database.select("*")
        .table("users")
        .where("active", true);

      if (users.length == 0) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      }
      response.status(200).send(users);
    } catch (error) {
      response.status(400).send({ error: `Erro: ${error.message}` });
    }
  }

  /**
   * Create/save a new user.
   * POST users
   * ANCHOR STORE
   */
  async store({ request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(), {
        username: "string|required|unique:users,username",
        password: "string|required|min:6|max:64",
        email: "string|required|email|unique:users,email",
        enrollment: "string|required|unique:users,enrollment",
        user_type: "integer|required",
        first_name: "string|required",
        surname: "string|required",
      });

      const rules = await validateAll(
        request.only(["enrollment", "user_type"]),
        {
          enrollment: [rule("regex", /[0-9]{8}/g)],
        }
      );

      if (validation.fails()) {
        return response.status(401).send({ message: validation.messages() });
      }
      if (rules.fails()) {
        return response.status(401).send({ message: rules.messages() });
      }

      const dataToCreate = request.only([
        "username",
        "password",
        "email",
        "enrollment",
        "user_type",
        "first_name",
        "surname",
      ]);
      const usuario = await User.create(dataToCreate, trx);
      await trx.commit();
      response.status(201).send(usuario);
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({ error: `Erro: ${error.message}` });
    }
  }

  /**
   * Display a single user.
   * GET users/:id
   * ANCHOR SHOW
   */
  async show({ params, request, response, view }) {
    try {
      const user = await Database.select("*")
        .table("users")
        .where("active", true)
        .where("id", params.id)
        .first();

      if (!user) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      }
      response.send(user);
    } catch (error) {
      response.status(400).send({ error: `Erro: ${error.message}` });
    }
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   * ANCHOR UPDATE
   */
  async update({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(), {
        username: "unique:users,username",
        password: "min:6|max:64",
        email: "email|unique:users,email",
        enrollment: "unique:users,enrollment",
        user_type: "string",
        first_name: "string",
        surname: "string",
      });
      const rules = await validateAll(
        request.only(["enrollment", "user_type"]),
        {
          enrollment: [rule("regex", /[0-9]{8}/g)],
          user_type: [rule("regex", /\b(administrador|tutor|aluno)\b/g)],
        }
      );

      if (validation.fails()) {
        return response.status(401).send({ message: validation.messages() });
      }
      if (rules.fails()) {
        return response.status(401).send({ message: rules.messages() });
      }

      // const {username, password, email, enrollment, user_type, first_name, surname} = request.all();
      const dataToUpdate = request.all();
      const user = await User.findBy("id", params.id);
      if (!user) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      }
      user.merge({ ...dataToUpdate });
      await user.save(trx);
      await trx.commit();
      return response
        .status(200)
        .send({ message: `Usuário alterado com sucesso ` });
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({ error: `Erro: ${error.message}` });
    }
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   * ANCHOR DESTROY
   */
  async destroy({ params, request, response }) {
    /*----------------------------------------------------------------
    DESATIVA O USUÁRIO
    ----------------------------------------------------------------*/
    const trx = await Database.beginTransaction();
    try {
      const user = await User.findBy("id", params.id);
      if (!user) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      } else if (user.active == false) {
        return response
          .status(406)
          .send({ message: "O usuário já foi removido" });
      }
      user.active = false;
      await user.save(trx);
      await trx.commit();
      return response.status(200).send({ message: "Usuário Desativado" });
    } catch (error) {
      awaitrollback();
      return response.status(400).send(error);
    }
  }

  async getByType({ params, request, response }) {
    try {
      const users = await Database.select("id", "first_name", "surname")
        .table("users")
        .where("active", true)
        .where("user_type", params.type);
      response.status(200).send(users);
    } catch (error) {
      response.status(404).send({ message: "Nenhum usuário encontrado" });
    }
  }
}

module.exports = UserController;

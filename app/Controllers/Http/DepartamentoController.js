"use strict";

const Log = use("App/Models/SystemLog");
const Departamento = use("App/Models/Departamento");
const Database = use("Database");
const { validateAll, rule } = use("Validator");

class DepartamentoController {
  /**
   * Show a list of all departamentos.
   * GET departamentos
   * ANCHOR INDEX
   */
  async index({ request, response, auth }) {
    if (auth.user.user_type == "administrador") {
      try {
        const departamentos = await Database.select("*")
          .table("departamentos")
          .where("active", true);
        response.status(200).send(departamentos);
      } catch (error) {
        response.status(400).send({ error: `Erro: ${error.message}` });
      }
    } else
      response.status(401).send({
        message:
          "O tipo de usuário não tem permissão para executar esta funcionalidade",
      });
  }

  /**
   * Create/save a new departamento.
   * POST departamentos
   * ANCHOR STORE
   */
  async store({ request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == "administrador") {
      try {
        const validation = await validateAll(request.all(), {
          name: "string|required",
          abbreviation: "string|required|unique:departamentos,abbreviation",
        });
        const rules = await validateAll(request.only(["abbreviation"]), {
          abbreviation: [rule("regex", /\b[D]{1}[A-Z]{3}\b/g)],
        });

        if (validation.fails()) {
          return response.status(401).send({ message: validation.messages() });
        }
        if (rules.fails()) {
          return response.status(401).send({ message: rules.messages() });
        }

        const dataToCreate = await request.all();
        const departamento = await Departamento.create(dataToCreate, trx);
        var log = {
          log: `Usuário ${auth.user.username} de ID ${auth.user.id} adicionou o Departamento ${departamento.abbreviation} de ID ${departamento.id}. Data de Criação: ${departamento.created_at}`,
        };
        await Log.create(log, trx);
        await trx.commit();
        return response.send(departamento);
      } catch (error) {
        await trx.rollback();
        await trx2.rollback();
        return response.status(500).send(`Erro: ${error.message}`);
      }
    } else
      response.status(401).send({
        message:
          "O tipo de usuário não tem permissão para executar esta funcionalidade",
      });
  }

  /**
   * Display a single departamento.
   * GET departamentos/:id
   * ANCHOR SHOW
   */
  async show({ params, request, response, auth }) {
    if (auth.user.user_type == "administrador") {
      try {
        const departamento = await Database.select("*")
          .table("departamentos")
          .where("active", true)
          .where("id", params.id)
          .first();

        if (!departamento) {
          return response
            .status(404)
            .send({ message: "Nenhum registro localizado" });
        }
        response.status(200).send(departamento);
      } catch (error) {
        return response.status(400).send(`Erro: ${error.message}`);
      }
    } else
      response.status(401).send({
        message:
          "O tipo de usuário não tem permissão para executar esta funcionalidade",
      });
  }

  /**
   * Update departamento details.
   * PUT or PATCH departamentos/:id
   * ANCHOR UPDATE
   */
  async update({ params, request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == "administrador") {
      try {
        const validation = await validateAll(request.all(), {
          name: "string",
          abbreviation: "string|unique:departamentos,abbreviation",
        });
        const rules = await validateAll(request.only(["abbreviation"]), {
          abbreviation: [rule("regex", /\b[D]{1}[A-Z]{3}\b/g)],
        });

        if (validation.fails()) {
          return response.status(401).send({ message: validation.messages() });
        }
        if (rules.fails()) {
          return response.status(401).send({ message: rules.messages() });
        }

        const dataToUpdate = request.all();
        const departamento = await Departamento.findBy("id", params.id);
        console.log(departamento);
        if (!departamento) {
          return response
            .status(404)
            .send({ message: "Nenhum registro localizado" });
        }
        departamento.merge({ ...dataToUpdate });

        await departamento.save(trx);
        var log = {
          log: `Usuário ${auth.user.username} de ID ${auth.user.id} editou o Departamento ${departamento.abbreviation} de ID ${departamento.id}. Data de Edição: ${departamento.updated_at}`,
        };
        await Log.create(log, trx);
        await trx.commit();
        return response.status(200).send(departamento);
      } catch (error) {
        await trx.rollback();
        return response.status(400).send(`Erro: ${error.message}`);
      }
    } else
      response.status(401).send({
        message:
          "O tipo de usuário não tem permissão para executar esta funcionalidade",
      });
  }

  /**
   * Delete a departamento with id.
   * DELETE departamentos/:id
   * ANCHOR DESTROY
   */
  async destroy({ params, request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == "administrador") {
      try {
        const departamento = await Departamento.findBy("id", params.id);
        if (!departamento) {
          return response
            .status(404)
            .send({ message: "Nenhum registro localizado" });
        } else if (departamento.active == false) {
          return response
            .status(406)
            .send({ message: "O departamento já foi removido" });
        }
        departamento.active = false;
        await departamento.save(trx);
        var log = {
          log: `Usuário ${auth.user.username} de ID ${auth.user.id} desativou o Departamento ${departamento.abbreviation} de ID ${departamento.id}. Data de Desativação: ${departamento.updated_at}`,
        };
        await Log.create(log, trx);
        await trx.commit();
        return response
          .status(200)
          .send({ message: "Departamento desativado" });
      } catch (error) {
        return response.status(400).send(`Erro: ${error.message}`);
      }
    } else {
      response.status(401).send({
        message:
          "O tipo de usuário não tem permissão para executar esta funcionalidade",
      });
    }
  }
  /**
   * Show a list of all disciplinas related to a departamento
   * GET disciplinas-departamento/:id
   * ANCHOR getDisciplinas
   */
  async getDisciplinas({ request, response, params, auth }) {
    if (auth.user.user_type == "administrador") {
      try {
        const disciplinas = await Database.select("*")
          .table("disciplinas")
          .where("active", true)
          .where("departamento_id", params.id);

        if (disciplinas.length == 0) {
          return response.status(404).send({
            message:
              "Nenhum registro de disciplinas localizado para este departamento",
          });
        }
        return response.status(200).send(disciplinas);
      } catch (error) {
        return response.status(400).send(`Erro: ${error.message}`);
      }
    } else {
      response.status(401).send({
        message:
          "O tipo de usuário não tem permissão para executar esta funcionalidade",
      });
    }
  }
}

module.exports = DepartamentoController;

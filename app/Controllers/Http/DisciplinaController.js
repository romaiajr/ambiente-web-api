"use strict";

const Disciplina = use("App/Models/Disciplina");
const Database = use("Database");
const { validateAll, rule } = use("Validator");
const Log = use("App/Models/SystemLog");

class DisciplinaController {
  /**
   * Show a list of all disciplinas.
   * GET disciplinas
   * ANCHOR INDEX
   */
  async index({ request, response }) {
    try {
      const disciplinas = await Database.select("*")
        .table("disciplinas")
        .where("active", true);

      // if(disciplinas.length == 0){
      //   return response.status(404).send({message: 'Nenhum registro localizado'})
      // }
      response.status(200).send(disciplinas);
    } catch (error) {
      response.status(400).send({ error: `Erro: ${error.message}` });
    }
  }

  /**
   * Create/save a new disciplina.
   * POST disciplinas
   * ANCHOR STORE
   */
  async store({ request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == "administrador") {
      try {
        const validation = await validateAll(request.all(), {
          code: "string|required|unique:disciplinas,code",
          name: "string|required",
          workload: "required|integer",
          departamento_id: "required|integer",
        });
        const rules = await validateAll(request.only(["code", "workload"]), {
          code: [rule("regex", /\b[A-Z]{3}[0-9]{3}\b/g)],
          workload: [rule("regex", /\b(30|45|60|90)\b/g)],
        });

        if (validation.fails()) {
          return response.status(401).send({ message: validation.messages() });
        }
        if (rules.fails()) {
          return response.status(401).send({ message: rules.messages() });
        }

        const dataToCreate = request.all();
        const disciplina = await Disciplina.create(dataToCreate, trx);
        var log = {
          log: `Usuário ${auth.user.username} de ID ${auth.user.id} adicionou a Disciplina ${disciplina.code} de ID ${disciplina.id}. Data de Criação: ${disciplina.created_at}`,
        };
        await Log.create(log, trx);
        await trx.commit();
        return response.status(200).send(disciplina);
      } catch (error) {
        await trx.rollback();
        return response.status(400).send({ error: `Erro: ${error.message}` });
      }
    } else
      response.status(401).send({
        message:
          "O tipo de usuário não tem permissão para executar esta funcionalidade",
      });
  }

  /**
   * Display a single disciplina.
   * GET disciplinas/:id
   * ANCHOR SHOW
   */
  async show({ params, request, response }) {
    try {
      const disciplina = await Database.select("*")
        .table("disciplinas")
        .where("active", true)
        .where("id", params.id)
        .first();

      if (!disciplina) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      }
      response.status(200).send(disciplina);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Update disciplina details.
   * PUT or PATCH disciplinas/:id
   * ANCHOR UPDATE
   */
  async update({ params, request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == "administrador") {
      try {
        const validation = await validateAll(request.all(), {
          code: "string|unique:disciplinas,code",
          name: "string",
          workload: "integer",
        });
        const rules = await validateAll(request.only(["code", "workload"]), {
          code: [rule("regex", /\b[A-Z]{3}[0-9]{3}\b/g)],
          workload: [rule("regex", /\b(30|60)\b/g)],
        });

        if (validation.fails()) {
          return response.status(401).send({ message: validation.messages() });
        }
        if (rules.fails()) {
          return response.status(401).send({ message: rules.messages() });
        }

        const dataToUpdate = request.all();
        const disciplina = await Disciplina.findBy("id", params.id);

        if (!disciplina) {
          return response
            .status(404)
            .send({ message: "Nenhum registro localizado" });
        }
        disciplina.merge({ ...dataToUpdate });

        await disciplina.save(trx);
        var log = {
          log: `Usuário ${auth.user.username} de ID ${auth.user.id} editou a Disciplina ${disciplina.code} de ID ${disciplina.id}. Data de Edição: ${disciplina.created_at}`,
        };
        await Log.create(log, trx);
        await trx.commit();
        return response.status(200).send(disciplina);
        // response.status(201).send({message: 'Informações alteradas com sucesso!'})
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
   * Delete a disciplina with id.
   * DELETE disciplinas/:id
   * ANCHOR DESTROY
   */
  async destroy({ params, request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == "administrador") {
      try {
        const disciplina = await Disciplina.findBy("id", params.id);
        if (!disciplina) {
          return response
            .status(404)
            .send({ message: "Nenhum registro localizado" });
        } else if (disciplina.active == false) {
          return response
            .status(406)
            .send({ message: "O disciplina já foi removida" });
        }
        disciplina.active = false;
        await disciplina.save(trx);
        var log = {
          log: `Usuário ${auth.user.username} de ID ${auth.user.id} desativou a Disciplina ${disciplina.code} de ID ${disciplina.id}. Data de Desativação: ${disciplina.created_at}`,
        };
        await Log.create(log, trx);
        await trx.commit();
        return response.status(200).send({ message: "Disciplina desativada" });
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
   * Show a list of all problemas related to a disciplina
   * GET disciplinas-ofertadas-problemas/:id
   * ANCHOR getProblemas
   */
  async getProblemas({ request, response, params }) {
    try {
      const problemas = await Database.select(
        "problemas.id as problema_id",
        "problemas.title as problema_title",
        "problemas.description as problema_description",
        "semestres.code as semestre"
      )
        .table("problema_unidades")
        .innerJoin("problemas", "problema_unidades.problema_id", "problemas.id")
        .innerJoin(
          "disciplina_ofertadas",
          "problema_unidades.disciplina_ofertada_id",
          "disciplina_ofertadas.id"
        )
        .innerJoin(
          "disciplinas",
          "disciplina_ofertadas.disciplina_id",
          "disciplinas.id"
        )
        .innerJoin(
          "semestres",
          "disciplina_ofertadas.semestre_id",
          "semestres.id"
        )
        .where("disciplinas.id", params.id);

      if (problemas.length == 0) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      }
      return response.status(200).send(problemas);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  //TODO getDisciplinasOfertadas retorna todas as vezes que a disciplina foi ofertada
}

module.exports = DisciplinaController;

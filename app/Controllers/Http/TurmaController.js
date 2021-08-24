"use strict";

const Turma = use("App/Models/Turma");
const DisciplinaOfertada = use("App/Models/DisciplinaOfertada");
const Log = use("App/Models/SystemLog");
const Database = use("Database");
const { validateAll, rule } = use("Validator");

class TurmaController {
  /**
   * Show a list of all turmas.
   * GET turmas
   * ANCHOR INDEX
   */
  async index({ request, response, view }) {
    try {
      const turmas = await Database.select(
        "turmas.id as id",
        "turmas.code as code",
        "disciplina_ofertadas.id as disciplina_ofertada_id",
        "disciplinas.code as disciplina_code",
        "disciplinas.name as disciplina_name",
        "semestres.code as semestre_code",
        "class_days",
        "class_time"
      )
        .table("turmas")
        .innerJoin(
          "disciplina_ofertadas",
          "turmas.disciplina_id",
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
        );
      return response.status(200).send(turmas);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Create/save a new turma.
   * POST turmas
   * ANCHOR STORE
   */
  async store({ request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == 1) {
      try {
        const validation = await validateAll(request.all(), {
          disciplina_id: "required|integer",
          code: "required|string",
          class_days: "required|string",
          class_time: "required|string"
        });

        if (validation.fails()) {
          return response.status(401).send({ message: validation.messages() });
        }
        const dataToCreate = request.all();
        const turma = await Turma.create(dataToCreate, trx);
        var log = {
          log: `Usuário "${auth.user.username}" de ID ${auth.user.id} criou a Turma ${turma.code} de ID ${turma.id} integrante da Disciplina Ofertada de ID ${turma.disciplina_id}.`,
        };
        await Log.create(log, trx);
        await trx.commit();
        return response.status(200).send(turma);
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
   * Display a single turma.
   * GET turmas/:id
   * ANCHOR SHOW
   */
  async show({ params, request, response }) {
    try {
      const turma = await Database.select(
        "turmas.id as id",
        "turmas.code as code",
        "disciplina_ofertadas.id as disciplina_ofertada_id",
        "disciplinas.code as disciplina_code",
        "disciplinas.name as disciplina_name",
        "semestres.code as semestre_code",
        "class_days",
        "class_time"
      )
        .table("turmas")
        .innerJoin(
          "disciplina_ofertadas",
          "turmas.disciplina_id",
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
        .where("turmas.id", parseInt(params.id))
        .first();
      if (!turma) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      }
      return response.status(200).send(turma);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Delete a turma with id.
   * DELETE turmas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == 1) {
      try {
        const turma = await Turma.findBy("id", params.id);
        if (!turma) {
          return response
            .status(404)
            .send({ message: "Nenhum registro localizado" });
        }
        const disciplinaOfertada_id = turma.disciplina_id;
        await turma.delete(trx);
        var date = this.getDate();
        var log = {
          log: `Usuário "${auth.user.username}" de ID ${auth.user.id} excluiu a Turma ${turma.code} de ID ${turma.id} integrante da Disciplina Ofertada de ID ${turma.disciplina_id}.`,
        };
        await Log.create(log, trx);
        const turmas = await Database.select("*")
          .table("turmas")
          .where("turmas.disciplina_id", disciplinaOfertada_id);
        // Caso seja a única turma da Disciplina Ofertada, a disciplina ofertada será removida
        if (turmas.length == 1) {
          const disciplinaOfertada = await DisciplinaOfertada.findBy(
            "id",
            disciplinaOfertada_id
          );
          await disciplinaOfertada.delete(trx);
          log = {
            log: `Disciplina Ofertada de ID ${disciplinaOfertada_id} removida por não possuir mais turmas.`,
          };
          await Log.create(log, trx);
        }
        await trx.commit();
        return response
          .status(200)
          .send({ message: "A turma foi removida do sistema!" });
      } catch (error) {
        await trx.rollback();
        return response.status(400).send({ erro: `Erro: ${error.message}` });
      }
    } else
      response.status(401).send({
        message:
          "O tipo de usuário não tem permissão para executar esta funcionalidade",
      });
  }

  async getTutores({ params, request, response }) {
    try {
      const turmaTutor = await Database.select(
        "users.first_name",
        "users.surname",
        "users.id as user_id",
        "turmas.id as turma_id"
      )
        .table("users")
        .innerJoin("turma_tutors", "turma_tutors.user_id", "users.id")
        .innerJoin("turmas", "turmas.id", "turma_tutors.turma_id")
        .where("turmas.id", params.id);
      if (!turmaTutor) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      }
      return response.status(200).send(turmaTutor);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }
}

module.exports = TurmaController;

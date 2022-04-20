"use strict";

const TurmaTutor = use("App/Models/TurmaTutor");
const Database = use("Database");
const Log = use("App/Models/SystemLog");
const { validateAll, rule } = use("Validator");

const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

class TurmaTutorController {
  /**
   * Show a list of all turmatutors.
   * GET turmatutors
   */
  async index({ request, response, view }) {
    try {
      const turmaTutor = await TurmaTutor.all();
      return response.status(200).send(turmaTutor);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  async getTurmas({ auth, response }) {
    if (auth.user.user_type == 2) {
      try {
        const turmas = await Database.select(
          "turmas.id as turma_id",
          "turmas.code as turma_code",
          "semestres.code as semestre_code",
          "disciplinas.code as disciplina_code",
          "disciplinas.name as disciplina_name",
          "class_days",
          "class_time"
        )
          .table("turma_tutors")
          .innerJoin("turmas", "turma_tutors.turma_id", "turmas.id")
          .innerJoin(
            "disciplina_ofertadas",
            "turmas.disciplina_id",
            "disciplina_ofertadas.id"
          )
          .innerJoin(
            "semestres",
            "disciplina_ofertadas.semestre_id",
            "semestres.id"
          )
          .innerJoin(
            "disciplinas",
            "disciplina_ofertadas.disciplina_id",
            "disciplinas.id"
          )
          .where("turma_tutors.user_id", auth.user.id);
        if (!turmas) {
          return response
            .status(404)
            .send({ message: "Nenhum registro localizado" });
        }
        const groupBySemestre = groupBy('semestre_code');
        return response.status(200).send(groupBySemestre(turmas));
      } catch (error) {
        return response.status(400).send({ error: `Erro: ${error.message}` });
      }
    } else
      response.status(401).send({
        message:
          "O tipo de usuário não tem permissão para executar esta funcionalidade",
      });
  }

  /**
   * Create/save a new turmatutor.
   * POST turmatutors
   */
  async store({ request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == 1) {
      try {
        const validation = await validateAll(request.all(), {
          user_id: "required|integer",
          turma_id: "required|integer",
        });

        if (validation.fails()) {
          return response.status(401).send({ message: validation.messages() });
        }

        const dataToCreate = await request.all();
        const turmaTutor = await TurmaTutor.create(dataToCreate, trx);
        var tutor = await Database.select("*")
          .table("users")
          .where("users.id", turmaTutor.user_id)
          .first();
        var turma = await Database.select("*")
          .table("turmas")
          .where("turmas.id", turmaTutor.turma_id)
          .first();
        var log = {
          log: `Usuário ${auth.user.username} de ID ${auth.user.id} designou o Tutor ${tutor.first_name} ${tutor.surname} de ID ${turmaTutor.user_id} à Turma ${turma.code} de ID ${turma.id} integrante da Disciplina Ofertada de ID ${turma.disciplina_id}. Data de Designação: ${turmaTutor.created_at}`,
        };
        await Log.create(log, trx);
        await trx.commit();
        return response.status(200).send(turmaTutor);
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
}

module.exports = TurmaTutorController;

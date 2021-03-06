"use strict";

const TurmaTutor = use("App/Models/TurmaTutor");
const Database = use("Database");
const Log = use("App/Models/SystemLog");
const { validateAll, rule } = use("Validator");

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

  /**
   * Create/save a new turmatutor.
   * POST turmatutors
   */
  async store({ request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == "administrador") {
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

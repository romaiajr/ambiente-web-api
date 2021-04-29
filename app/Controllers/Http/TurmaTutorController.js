"use strict";

const TurmaTutor = use("App/Models/TurmaTutor");
const Database = use("Database");
const { validateAll, rule } = use("Validator");

class TurmaTutorController {
  /**
   * Show a list of all turmatutors.
   * GET turmatutors
   */
  async index({ request, response, view }) {
    try {
      const turmaTutor = await TurmaTutor.all();
      // if (turmaTutor.length == 0) {
      //   return response
      //     .status(404)
      //     .send({ message: "Nenhum registro encontrado" });
      // }
      return response.status(200).send(turmaTutor);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Create/save a new turmatutor.
   * POST turmatutors
   */
  async store({ request, response }) {
    const trx = await Database.beginTransaction();
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
      await trx.commit();
      return response.status(200).send(turmaTutor);
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({ error: `Erro: ${error.message}` });
    }
  }

  /**
   * Delete a turmatutor with id.
   * DELETE turmatutors/:id
   */
  async destroy({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const turmaAluno = await TurmaAluno.findBy("id", params.id);
      if (!turmaAluno) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      }
      await turmaAluno.delete(trx);
      await trx.commit();
      return response
        .status(200)
        .send({ message: "O aluno foi removido da turma!" });
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({ erro: `Erro: ${error.message}` });
    }
  }
}

module.exports = TurmaTutorController;

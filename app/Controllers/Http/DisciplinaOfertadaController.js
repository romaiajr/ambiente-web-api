"use strict";

const DisciplinaOfertada = use("App/Models/DisciplinaOfertada");
const Log = use("App/Models/SystemLog");
const Database = use("Database");
const { validateAll } = use("Validator");

class DisciplinaOfertadaController {
  /**
   * Show a list of all disciplinaofertadas.
   * GET disciplinaofertadas
   * ANCHOR INDEX
   */
  async index({ request, response, view }) {
    try {
      //NOTE revisar os dados selecionados
      const disciplinasOfertadas = await Database.select(
        "disciplina_ofertadas.id as id",
        "disciplinas.code as disciplina_code",
        "disciplinas.name as disciplina_name",
        "semestres.code as semestre",
        "disciplina_ofertadas.number_of_classes"
      )
        .table("disciplina_ofertadas")
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
        .where("disciplina_ofertadas.active", true);

      if (disciplinasOfertadas.length == 0) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      }
      response.status(200).send(disciplinasOfertadas);
    } catch (error) {
      response.status(400).send({ error: `Erro: ${error.message}` });
    }
  }

  /**
   * Create/save a new disciplinaofertada.
   * POST disciplinaofertadas
   * ANCHOR STORE
   */
  async store({ request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == "administrador") {
      try {
        const validation = await validateAll(request.all(), {
          semestre_id: "required|integer",
          disciplina_id: "required|integer",
          number_of_classes: "required|integer",
        });

        if (validation.fails()) {
          return response.status(401).send({ message: validation.messages() });
        }

        const dataToCreate = request.all();
        const disciplinaOfertada = await DisciplinaOfertada.create(
          dataToCreate,
          trx
        );
        var semestre = await Database.select("*")
          .table("semestres")
          .where("semestres.id", disciplinaOfertada.semestre_id)
          .first();
        var disciplina = await Database.select("*")
          .table("disciplinas")
          .where("disciplinas.id", disciplinaOfertada.disciplina_id)
          .first();
        var log = {
          log: `Usuário "${auth.user.username}" de ID ${auth.user.id} ofertou a Disciplina ${disciplina.code} no Semestre ${semestre.code}.`,
        };
        await Log.create(log, trx);
        await trx.commit();
        return response.status(200).send(disciplinaOfertada);
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
   * Display a single disciplinaofertada.
   * GET disciplinaofertadas/:id
   * ANCHOR SHOW
   */
  async show({ params, request, response }) {
    try {
      //NOTE revisar os dados selecionados
      const disciplinaOfertada = await Database.select(
        "disciplina_ofertadas.id as id",
        "disciplinas.code as disciplina_code",
        "disciplinas.name as disciplina_name",
        "semestres.code as semestre",
        "disciplina_ofertadas.number_of_classes"
      )
        .table("disciplina_ofertadas")
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
        .where("disciplina_ofertadas.id", params.id)
        .where("disciplina_ofertadas.active", true)
        .first();

      if (!disciplinaOfertada) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      }
      response.status(200).send(disciplinaOfertada);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Update disciplinaofertada details.
   * PUT or PATCH disciplinaofertadas/:id
   * ANCHOR UPDATE
   */
  async update({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(), {
        number_of_classes: "integer",
      });

      if (validation.fails()) {
        return response.status(401).send({ message: validation.messages() });
      }

      const dataToUpdate = request.all();
      const disciplinaOfertada = await DisciplinaOfertada.findBy(
        "id",
        params.id
      );

      if (!disciplinaOfertada) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      }
      disciplinaOfertada.merge({ ...dataToUpdate });

      await disciplinaOfertada.save(trx);
      await trx.commit();
      return response.status(200).send(disciplinaOfertada);
      // response.status(201).send({message: 'Informações alteradas com sucesso!'})
    } catch (error) {
      await trx.rollback();
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Delete a disciplinaofertada with id.
   * DELETE disciplinaofertadas/:id
   * ANCHOR DESTROY
   */
  async destroy({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const disciplinaOfertada = await DisciplinaOfertada.findBy(
        "id",
        params.id
      );
      if (!disciplinaOfertada) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      } else if (disciplinaOfertada.active == false) {
        return response
          .status(406)
          .send({ message: "O disciplina já foi removida" });
      }
      disciplinaOfertada.active = false;
      await disciplinaOfertada.save(trx);
      await trx.commit();
      return response
        .status(200)
        .send({ message: "Disciplina Ofertada Desativada" });
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Show a list of all problemas related to a disciplina ofertada
   * GET disciplinas-ofertadas-problemas/:id
   * ANCHOR getProblemas
   */
  async getProblemas({ request, response, params }) {
    try {
      const problemas = await Database.select(
        "problemas.id as problema_id",
        "problemas.title as problema_title",
        "problemas.description as problema_description"
      )
        .table("problema_unidades")
        .innerJoin("problemas", "problema_unidades.problema_id", "problemas.id")
        .innerJoin(
          "disciplina_ofertadas",
          "problema_unidades.disciplina_ofertada_id",
          "disciplina_ofertadas.id"
        )
        .where("disciplina_ofertadas.id", params.id);

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
}

module.exports = DisciplinaOfertadaController;

"use strict";

const Semestre = use("App/Models/Semestre");
const Database = use("Database");
const { validateAll, rule } = use("Validator");

class SemestreController {
  /**
   * Show a list of all semestres.
   * GET semestres
   * ANCHOR INDEX
   */
  async index({ request, response, auth }) {
    try {
      const semestres = await Database.select("*")
        .table("semestres")
        .where("active", true);

      if (semestres.length == 0) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      }
      return response.send(semestres);
    } catch (error) {
      return response.status(500).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Create/save a new departamento.
   * POST semestre
   * ANCHOR STORE
   */
  async store({ request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(), {
        code: "string|required|unique:semestres,code",
        start_date: "required|string",
        end_date: "required|string|different:start_date",
      });

      const rules = await validateAll(request.only(["code"]), {
        code: [rule("regex", /([2]{1}[0]{1}[0-9]{2}[\.]{1}[1-3]{1})/g)],
      });

      if (validation.fails()) {
        return response.status(401).send({ message: validation.messages() });
      }
      if (rules.fails()) {
        return response.status(401).send({ message: rules.messages() });
      }

      const dataToCreate = await request.all();
      const semestre = await Semestre.create(dataToCreate, trx);
      await trx.commit();
      return response
        .status(201)
        .send({ message: "Semestre criado com sucesso!" });
      // return response.send(semestre)
    } catch (error) {
      await trx.rollback();
      return response.status(500).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Display a single departamento.
   * GET semestre/:id
   * ANCHOR SHOW
   */
  async show({ params, request, response }) {
    try {
      const semestre = await Database.select("*")
        .table("semestres")
        .where("active", true)
        .where("id", params.id)
        .first();

      if (!semestre) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      }
      response.status(200).send(semestre);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  async update({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(), {
        code: "string|unique:semestres,code",
        start_date: "date",
        end_date: "date|different:start_date",
      });

      const rules = await validateAll(request.only(["code"]), {
        code: [rule("regex", /([2]{1}[0]{1}[0-9]{2}[\.]{1}[1-2]{1})/g)],
      });

      if (validation.fails()) {
        return response.status(401).send({ message: validation.messages() });
      }

      if (rules.fails()) {
        return response.status(401).send({ message: rules.messages() });
      }

      const dataToUpdate = request.all();
      const semestre = await Semestre.findBy("id", params.id);

      if (!semestre) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      }
      semestre.merge({ ...dataToUpdate });

      await semestre.save(trx);
      await trx.commit();
      // return response.status(200).send(semestre);
      return response
        .status(200)
        .send({
          message: "Informações alteradas com sucesso!",
          semestre: semestre,
        });
    } catch (error) {
      await trx.rollback();
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Delete a departamento with id.
   * DELETE semestre/:id
   * ANCHOR DESTROY
   */
  async destroy({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const semestre = await Semestre.findBy("id", params.id);
      if (!semestre) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      } else if (semestre.active == false) {
        return response
          .status(406)
          .send({ message: "O semestre já foi removido" });
      }
      semestre.active = false;
      await semestre.save(trx);
      await trx.commit();
      return response.status(200).send({ message: "Semestre desativado" });
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Show a list of all disciplinas ofertadas related to a semestre
   * GET disciplinas-ofertadas-semestre/:id
   * ANCHOR getDisciplinas
   */
  async getDisciplinasOfertadas({ request, response, params }) {
    try {
      const disciplinasOfertadas = await Database.select(
        "disciplina_ofertadas.id",
        "disciplinas.code",
        "disciplinas.name"
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
        .where("disciplina_ofertadas.active", true)
        .where("semestres.id", params.id);

      if (disciplinasOfertadas.length == 0) {
        return response.status(404).send({
          message:
            "Nenhum registro de disciplina ofertada para este semestre foi encontrado!",
        });
      }
      return response.status(200).send(disciplinasOfertadas);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  //TODO getProblemasSemestre retorna todos problemas unidade do semestre
}

module.exports = SemestreController;

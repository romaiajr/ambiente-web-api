"use strict";

const Log = use("App/Models/SystemLog");
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
      return response.status(200).send(semestres);
    } catch (error) {
      return response.status(500).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Create/save a new departamento.
   * POST semestre
   * ANCHOR STORE
   */
  async store({ request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == 1) {
      const error = {
        "code.unique": "Já existe um semestre cadastrado com este código.",
        "end_date.different":
          "A data de término do semestre deve ser diferente da data de início",
      };
      try {
        const validation = await validateAll(
          request.all(),
          {
            code: "string|required|unique:semestres,code",
            start_date: "required|string",
            end_date: "required|string|different:start_date",
          },
          error
        );

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
        var log = {
          log: `Usuário "${auth.user.username}" de ID ${auth.user.id} adicionou o Semestre ${semestre.code} de ID ${semestre.id}.`,
        };
        await Log.create(log, trx);
        await trx.commit();
        return response.status(200).send(semestre);
        // return response.send(semestre)
      } catch (error) {
        await trx.rollback();
        return response.status(500).send(`Erro: ${error.message}`);
      }
    } else {
      response.status(401).send({
        message:
          "O tipo de usuário não tem permissão para executar esta funcionalidade",
      });
    }
  }

  /**
   * Display a single Semestre.
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

  async update({ params, request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == 1) {
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
        var log = {
          log: `Usuário "${auth.user.username}" de ID ${auth.user.id} editou o Semestre ${semestre.code} de ID ${semestre.id}.`,
        };
        await Log.create(log, trx);
        await trx.commit();
        // return response.status(200).send(semestre);
        return response.status(200).send({
          message: "Informações alteradas com sucesso!",
          semestre: semestre,
        });
      } catch (error) {
        await trx.rollback();
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
   * Delete a departamento with id.
   * DELETE semestre/:id
   * ANCHOR DESTROY
   */
  async destroy({ params, request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == 1) {
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
        var log = {
          log: `Usuário "${auth.user.username}" de ID ${auth.user.id} desativou o Semestre ${semestre.code} de ID ${semestre.id}.`,
        };
        await Log.create(log, trx);
        await trx.commit();
        return response.status(200).send({ message: "Semestre desativado" });
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

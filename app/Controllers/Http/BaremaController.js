"use strict";
const Log = use("App/Models/SystemLog");
const Barema = use("App/Models/Barema");
const ItemBarema = use("App/Models/ItemBarema");
const Database = use("Database");
const { validateAll, rule } = use("Validator");

class BaremaController {
  /**
   * Create/save a new barema.
   * POST baremas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == 2) {
      try {
        const validation = await validateAll(request.all(), {
          name: "string|required",
        });
        if (validation.fails()) {
          return response.status(400).send({ message: validation.messages() });
        }
        const dataToCreate = {
          tutor_id: auth.user.id,
          name: request.only("name").name,
        };
        const barema = await Barema.create(dataToCreate, trx);
        let itens = [];
        let req = request.only(["itens"]);
        await Promise.all(
          req.itens.map(async (item) => {
            const validation2 = await validateAll(item, {
              name: "string|required",
              amount: "integer|required",
            });
            if (validation2.fails()) {
              return response
                .status(400)
                .send({ message: validation2.messages() });
            }
            let itemToCreate = {
              barema_id: barema.id,
              name: item.name,
              amount: item.amount,
            };
            itens.push(await ItemBarema.create(itemToCreate, trx));
          })
        );
        // var log = {
        //   log: `Usuário "${auth.user.username}" de ID ${auth.user.id} criou a Turma ${turma.code} de ID ${turma.id} integrante da Disciplina Ofertada de ID ${turma.disciplina_id}.`,
        // };
        // await Log.create(log, trx);
        const res = { barema, itens };
        await trx.commit();
        return response.status(200).send(res);
      } catch (error) {
        await trx.rollback();
        response.status(500).send({ error: `Erro: ${error.message}` });
      }
    } else
      response.status(401).send({
        message:
          "O tipo de usuário não tem permissão para executar esta funcionalidade",
      });
  }

  async index({ response, auth }) {
    if (auth.user.user_type == 2) {
      try {
        let data = [];
        const baremas = await Database.select("*")
          .table("baremas")
          .where("tutor_id", auth.user.id)
          .where("active", true);
        await Promise.all(
          baremas.map(async (barema) => {
            const itens = await Database.select("*")
              .table("item_baremas")
              .where("barema_id", barema.id)
              .where("active", true);
            data.push({ barema, itens });
          })
        );
        response.status(200).send(data);
      } catch (error) {
        response.status(400).send({ error: `Erro: ${error.message}` });
      }
    } else {
      response.status(401).send({
        message:
          "O tipo de usuário não tem permissão para executar esta funcionalidade",
      });
    }
  }

  /**
   * Display a single sessaopbl.
   * GET barema/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, auth }) {
    if (auth.user.user_type == 2) {
      try {
        const barema = await Database.select("*")
          .table("baremas")
          .where("active", true)
          .where("id", params.id)
          .first();

        if (!barema) {
          return response
            .status(404)
            .send({ message: "Nenhum registro localizado" });
        } else {
          const itens = await Database.select("*")
            .table("item_baremas")
            .where("active", true)
            .where("barema_id", params.id);
          response.status(200).send({ barema, itens });
        }
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
   * Update barema details.
   * PUT or PATCH baremas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == 2) {
      const validation = await validateAll(request.all(), {
        name: "string|required",
      });
      if (validation.fails()) {
        return response.status(401).send({ message: validation.messages() });
      }
      const dataToUpdate = request.only("name");
      const barema = await Barema.findBy("id", params.id);
      if (!barema) {
        return response
          .status(404)
          .send({ message: "Nenhum registro localizado" });
      }
      barema.merge({ ...dataToUpdate });
      await barema.save(trx);
      const itens = await Database.select("*")
        .table("item_baremas")
        .where("barema_id", params.id);

      await Promise.all(
        itens.map(async (item) => {
          if (item.active != false) {
            let toUpdate = await ItemBarema.findBy("id", item.id);
            toUpdate.active = false;
            toUpdate.save(trx);
          }
        })
      );
      let newItens = [];
      let req = request.only(["itens"]);
      await Promise.all(
        req.itens.map(async (item) => {
          const validation2 = await validateAll(item, {
            name: "string|required",
            amount: "integer|required",
          });
          if (validation2.fails()) {
            return response
              .status(401)
              .send({ message: validation2.messages() });
          }
          let itemToCreate = {
            barema_id: params.id,
            name: item.name,
            amount: item.amount,
          };
          newItens.push(await ItemBarema.create(itemToCreate, trx));
        })
      );
      await trx.commit();
      return response.status(200).send({ barema, itens: newItens });
    } else {
      response.status(401).send({
        message:
          "O tipo de usuário não tem permissão para executar esta funcionalidade",
      });
    }
  }

  /**
   * Delete a barema with id.
   * DELETE baremas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response, auth }) {
    const trx = await Database.beginTransaction();
    if (auth.user.user_type == 2) {
      try {
        const barema = await Barema.findBy("id", params.id);
        if (!barema) {
          return response
            .status(404)
            .send({ message: "Nenhum registro localizado" });
        } else if (barema.active == false) {
          return response
            .status(406)
            .send({ message: "O departamento já foi removido" });
        }
        barema.active = false;
        const itens = await Database.select("*")
          .table("item_baremas")
          .where("barema_id", params.id);

        await Promise.all(
          itens.map(async (item) => {
            if (item.active != false) {
              let toUpdate = await ItemBarema.findBy("id", item.id);
              toUpdate.active = false;
              toUpdate.save(trx);
            }
          })
        );
        await barema.save(trx);
        await trx.commit();
        return response.status(200).send({ message: "Barema desativado" });
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

module.exports = BaremaController;

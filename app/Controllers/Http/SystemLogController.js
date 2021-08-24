"use strict";

const Log = use("App/Models/SystemLog");
const Database = use("Database");

class SystemLogController {
  /**
   * Show a list of all systemlogs.
   * GET systemlogs
   */
  async index({ request, response, view, auth }) {
    if (auth.user.user_type == 1) {
      try {
        const logs = await Database.select("*").table("system_logs");
        return response.status(200).send(logs);
      } catch (error) {
        response.status(500).send({ message: `Erro: ${error}` });
      }
    } else
      response
        .status(401)
        .send({ message: "Usuário não tem permissão para acessar essa rota" });
  }
}

module.exports = SystemLogController;

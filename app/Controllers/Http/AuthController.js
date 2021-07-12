"use strict";
const Database = use("Database");
class AuthController {
  // ANCHOR LOGIN
  async login({ auth, request, response }) {
    try {
      const { username, password } = request.all();
      const token = await auth.attempt(username, password);
      const type = await Database.select("user_type")
        .table("users")
        .where("username", username)
        .first();
      console.log(type);
      return { token, type };
    } catch (error) {
      return response.status(500).send({ error: `Erro: ${error.message}` });
    }
  }
}

module.exports = AuthController;

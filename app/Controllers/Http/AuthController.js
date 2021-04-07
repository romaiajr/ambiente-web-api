"use strict";

class AuthController {
  // ANCHOR LOGIN
  async login({ auth, request, response }) {
    try {
      const { username, password, email } = request.all();
      const token = await auth.attempt(username, password);
      // if(username == null)
      //    validaToken = await auth.attempt(email,password)
      // else if(email == null)
      //    validaToken = await auth.attempt(username,password)
      return token;
    } catch (error) {
      return response.status(500).send({ error: `Erro: ${error.message}` });
    }
  }
}

module.exports = AuthController;

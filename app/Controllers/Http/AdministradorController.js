'use strict'

const Administrador = use('App/Models/Administrador')
const Database = use('Database');

class AdministradorController {
  /**
   * Show a list of all administradors.
   * GET administradors
   * ANCHOR INDEX
   */
  async index ({ request, response, view }) {
    try {
      const administradores = await Database.select('administradors.id','administradors.user_id','users.first_name','users.surname','enrollment').table('administradors').innerJoin('users','administradors.user_id','users.id').where('users.active',true);
      if(administradores.length == 0){
        response.status(404).send({message: "Nenhum registro localizado"})
      }
      response.send(administradores)
    } catch (error) {
      response.status(500).send(`Erro: ${error.message}`)
    }
  }


  /**
   * Display a single administrador.
   * GET administradors/:id
   * ANCHOR SHOW
   */
  async show ({ params, request, response }) {
    try {
      const administrador = await Database.select('administradors.id','administradors.user_id','users.first_name','users.surname','enrollment').table('administradors').innerJoin('users','administradors.user_id','users.id').where('users.active',true).where('administradors.id',params.id).first();
      if(!administrador){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      response.send(administrador)
    } catch (error) {
      response.status(500).send(`Erro: ${error.message}`)
    }
  }


  /**
   * Delete a administrador with id.
   * DELETE administradors/:id
   *
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = AdministradorController

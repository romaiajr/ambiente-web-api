'use strict'

const Tutor = use('App/Models/Tutor')
const Database = use('Database');

class TutorController {
  /**
   * Show a list of all tutors.
   * GET tutors
   * ANCHOR INDEX
   */
  async index ({ request, response, view }) {
    try {
      const tutores = await Database
        .select('tutors.id','tutors.user_id','users.first_name','users.surname','enrollment')
        .table('tutors').innerJoin('users','tutors.user_id','users.id')
        .where('users.active',true);

      if(tutores.length == 0){
        response.status(404).send({message: "Nenhum registro localizado"})
      }
      response.send(tutores)
    } catch (error) {
      response.status(500).send(`Erro: ${error.message}`)
    }
  }

  /**
   * Display a single tutor.
   * GET tutors/:id
   * ANCHOR SHOW
   */
  async show ({ params, request, response, view }) {
    try {
      const tutor = await Database
        .select('tutors.id','tutors.user_id','users.first_name','users.surname','enrollment')
        .table('tutors').innerJoin('users','tutors.user_id','users.id')
        .where('users.active',true)
        .where('tutors.id',params.id)
        .first();
        
      if(!tutor){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      response.send(tutor)
    } catch (error) {
      response.status(500).send(`Erro: ${error.message}`)
    }
  }

}

module.exports = TutorController

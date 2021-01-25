'use strict'

const Aluno = use('App/Models/Aluno')
const Database = use('Database')

class AlunoController {
  /**
   * Show a list of all alunos.
   * GET alunos
   * ANCHOR INDEX
   */
  async index ({ request, response, auth}) {
      try {
        const alunos = await Database.select('alunos.id','alunos.user_id','users.first_name','users.surname','enrollment').table('alunos').innerJoin('users','alunos.user_id','users.id').where('users.active',true);
        if(alunos.length == 0){
          response.status(404).send({message: "Nenhum registro localizado"})
        }
        response.send(alunos)
      } catch (error) {
        response.status(500).send(`Erro: ${error.message}`)
      }
  }

  /**
   * Display a single aluno.
   * GET alunos/:id
   * ANCHOR SHOW
   */
  async show ({ params, request, response }) {
    try {
      const aluno = await Database.select('alunos.id','alunos.user_id','users.first_name','users.surname','enrollment').table('alunos').innerJoin('users','alunos.user_id','users.id').where('users.active',true).where('alunos.id',params.id).first();
      if(!aluno){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      response.send(aluno)
    } catch (error) {
      response.status(500).send(`Erro: ${error.message}`)
    }
  }

  /**
   * Delete a aluno with id.
   * DELETE alunos/:id
   *
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = AlunoController

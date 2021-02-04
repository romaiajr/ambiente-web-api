'use strict'

const TurmaAluno = use('App/Models/TurmaAluno');
const Database = use('Database');
const {validateAll, rule} = use('Validator')

class TurmaAlunoController {
  /**
   * Show a list of all turmaalunos.
   * GET turmaalunos
   * ANCHOR INDEX
   */
  async index ({ request, response, view }) {
    try {
      const turmaAlunos = await TurmaAluno.all();
      if(turmaAlunos.length == 0){
        return response.status(404).send({message: 'Nenhum registro encontrado'});
      }
      return response.status(200).send(turmaAlunos);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Create/save a new turmaaluno.
   * POST turmaalunos
   * ANCHOR STORE
   */
  async store ({ request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(),{
        aluno_id: 'required|integer',
        turma_id: 'required|integer',
      }) 

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }

      const dataToCreate = await request.all();
      const turmaAluno = await TurmaAluno.create(dataToCreate,trx);
      await trx.commit();
      return response.status(200).send(turmaAluno);
      // return response.status(200).send("O aluno foi adicionado à turma com sucesso!")
      
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({error: `Erro: ${error.message}`});
    }
  }
  /**
   * Display a single turmaaluno.
   * GET turmaalunos/:id
   * ANCHOR SHOW
   */
  async show ({ params, request, response, }) {
    try {
      const turmaAluno = await TurmaAluno.findBy('id', params.id)
      if(!turmaAluno){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      return response.status(200).send(turmaAluno);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`)
    }
  }

  /**
   * Delete a turmaaluno with id.
   * DELETE turmaalunos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const turmaAluno = await TurmaAluno.findBy('id', params.id)
      if(!turmaAluno){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      await turmaAluno.delete(trx)
      await trx.commit();
      return response.status(200).send({message: "O aluno foi removido da turma!"});
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({erro: `Erro: ${error.message}`})
    }
  }
}

module.exports = TurmaAlunoController

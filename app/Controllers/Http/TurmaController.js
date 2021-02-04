'use strict'

const Turma = use('App/Models/Turma');
const Database = use('Database');
const {validateAll, rule} = use('Validator')

class TurmaController {
  /**
   * Show a list of all turmas.
   * GET turmas
   * ANCHOR INDEX
   */
  async index ({ request, response, view }) {
    try {
      const turmas = await Turma.all();
      if(turmas.length == 0){
        return response.status(404).send({message: 'Nenhum registro encontrado'});
      }
      return response.status(200).send(turmas);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Create/save a new turma.
   * POST turmas
   * ANCHOR STORE
   */
  async store ({ request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(),{
        disciplina_id: 'required|integer',
        tutor_id: 'integer',
      }) 

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }

      const dataToCreate = await request.all();
      const turma = await Turma.create(dataToCreate,trx);
      await trx.commit();
      return response.status(200).send(turma);
      // return response.status(200).send("A Turma foi criada com sucesso!")
      
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({error: `Erro: ${error.message}`});
    }
  }

  /**
   * Display a single turma.
   * GET turmas/:id
   * ANCHOR SHOW
   */
  async show ({ params, request, response, }) {
    try {
      const turma = await Turma.findBy('id', params.id)
      if(!turma){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      return response.status(200).send(turma);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`)
    }
  }

  /**
   * Update turma details.
   * PUT or PATCH turmas/:id
   * ANCHOR UPDATE
   */
  async update ({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(),{
        tutor_id: 'integer',
      })
      
      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }

      const dataToUpdate = request.all();
      const turma = await Turma.findBy('id', params.id)

      if(!turma){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }

      turma.merge({...dataToUpdate});
      turma.save(trx);
      await trx.commit();
      return response.status(200).send(turma)
      // return response.status(200).send("A turma foi modificada com sucesso!")
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({erro: `Erro: ${error.message}`})
    }
  }

  /**
   * Delete a turma with id.
   * DELETE turmas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const turma = await Turma.findBy('id', params.id)
      if(!turma){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      await turma.delete(trx)
      await trx.commit();
      return response.status(200).send({message: "A turma foi removida do sistema!"});
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({erro: `Erro: ${error.message}`})
    }
  }
}

module.exports = TurmaController

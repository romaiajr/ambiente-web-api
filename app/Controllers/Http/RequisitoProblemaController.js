'use strict'

const Requisito = use('App/Models/RequisitoProblema');
const Database = use('Database');
const {validateAll} = use('Validator')

class RequisitoProblemaController {

  /**
   * Create/save a new requisitoproblema.
   * POST requisitoproblemas
   * ANCHOR STORE
   */
  async store ({ request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(),{
        problema_id: 'required|integer',
        title: 'required|string',
        description: 'required|string'
      })

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }

      const dataToCreate = await request.all();
      const requisito = await Requisito.create(dataToCreate,trx);
      await trx.commit();
      return response.status(200).send(requisito);
      // return response.status(200).send("O requisito foi criado com sucesso!")
      
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({error: `Erro: ${error.message}`});
    }
  }

  /**
   * Display a single requisitoproblema.
   * GET requisitoproblemas/:id
   * ANCHOR SHOW
   */
  async show ({ params, request, response, }) {
    try {
      const requisito = await Requisito.findBy('id', params.id)
      if(!requisito){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      return response.status(200).send(requisito);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`)
    }
  }

  /**
   * Update requisitoproblema details.
   * PUT or PATCH requisitoproblemas/:id
   * ANCHOR UPDATE
   */
  async update ({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(),{
        title: 'string',
        description: 'string'
      })

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }
      
      const dataToUpdate = request.all();
      const requisito = await Requisito.findBy('id', params.id)

      if(!requisito){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }

      requisito.merge({...dataToUpdate});
      requisito.save(trx);
      await trx.commit();
      return response.status(200).send(requisito)
      // return response.status(200).send("O requisito foi modificado com sucesso!")
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({erro: `Erro: ${error.message}`})
    }
  }

  /**
   * Delete a requisitoproblema with id.
   * DELETE requisitoproblemas/:id
   * ANCHOR DESTROY
   */
  async destroy ({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const requisito = await Requisito.findBy('id', params.id)
      if(!requisito){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      await requisito.delete(trx)
      await trx.commit();
      return response.status(200).send("O requisito do problema foi removido do sistema!");
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({erro: `Erro: ${error.message}`})
    }
  }
}

module.exports = RequisitoProblemaController

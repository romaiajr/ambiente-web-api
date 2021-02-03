'use strict'

const Objetivo = use('App/Models/ObjetivoProblema');
const Database = use('Database');
const {validateAll} = use('Validator')

class ObjetivoProblemaController {

  /**
   * Create/save a new objetivoproblema.
   * POST objetivoproblemas
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
      const objetivo = await Objetivo.create(dataToCreate,trx);
      await trx.commit();
      return response.status(200).send(objetivo);
      // return response.status(200).send("O requisito foi criado com sucesso!")
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({error: `Erro: ${error.message}`});
    }
  }


  /**
   * Display a single objetivoproblema.
   * GET objetivoproblemas/:id
    * ANCHOR SHOW
   */
  async show ({ params, request, response, }) {
    try {
      const objetivo = await Objetivo.findBy('id', params.id)
      if(!objetivo){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      return response.status(200).send(objetivo);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`)
    }
  }

  /**
   * Update objetivoproblema details.
   * PUT or PATCH objetivoproblemas/:id
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
      const objetivo = await Objetivo.findBy('id', params.id)

      if(!objetivo){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }

      objetivo.merge({...dataToUpdate});
      objetivo.save(trx);
      await trx.commit();
      return response.status(200).send(objetivo)
      // return response.status(200).send("O objetivo foi modificado com sucesso!")
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({erro: `Erro: ${error.message}`})
    }
  }

  /**
   * Delete a objetivoproblema with id.
   * DELETE objetivoproblemas/:id
   * ANCHOR DESTROY
   */
  async destroy ({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const objetivo = await Objetivo.findBy('id', params.id)
      if(!objetivo){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      await objetivo.delete(trx)
      await trx.commit();
      return response.status(200).send({message: "O objetivo do problema foi removido do sistema!"});
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({erro: `Erro: ${error.message}`})
    }
  }
}

module.exports = ObjetivoProblemaController

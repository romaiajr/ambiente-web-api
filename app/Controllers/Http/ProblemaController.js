'use strict'

const Problema = use('App/Models/Problema');
const Database = use('Database');
const {validateAll, rule} = use('Validator');

class ProblemaController {
  /**
   * Show a list of all problemas.
   * GET problemas
   * ANCHOR INDEX
   */
  async index ({ request, response }) {
    try {
      const problemas = await Database
        .select('*')
        .table('problemas')
        .where('active',true);
        
      if(problemas.length == 0){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      response.status(200).send(problemas);
    } catch(error){
      response.status(400).send({error: `Erro: ${error.message}`})
    }
  }


  /**
   * Create/save a new problema.
   * POST problemas
   * ANCHOR STORE
   */
  async store ({ request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(),{
        title: 'required|string',
        description: 'required|string',
      })

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }

      const dataToCreate = request.all();
      const problema = await Problema.create(dataToCreate,trx);
      await trx.commit();
      // return response.status(201).send({message: "problema criada com sucesso!"})
      return response.send(problema)
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({ error: `Erro: ${error.message}`})
    }
  }

  /**
   * Display a single problema.
   * GET problemas/:id
   * ANCHOR SHOW
   */
  async show ({ params, request, response, view }) {
    try {
      const problema = await Database
        .select('*')
        .table('problemas')
        .where('active',true)
        .where('id',params.id).first()

      if(!problema){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      response.status(200).send(problema)
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Update problema details.
   * PUT or PATCH problemas/:id
   * ANCHOR UPDATE
   */
  async update ({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(),{
        title: 'string',
        description: 'string',
      })

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }
      const dataToUpdate = request.all();
      const problema = await Problema.findBy('id', params.id)
  
      if(!problema){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      problema.merge({...dataToUpdate})
  
      await problema.save(trx);
      await trx.commit();
      return response.status(200).send(problema);
      // response.status(201).send({message: 'Informações alteradas com sucesso!'})
      } catch (error) {
        await trx.rollback();
        return response.status(400).send(`Erro: ${error.message}`)
      }
  }

  /**
   * Delete a problema with id.
   * DELETE problemas/:id
   *
   */
  async destroy ({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const problema = await Problema.findBy('id', params.id);
      if(!problema){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      else if(problema.active == false){
        return response.status(406).send({message: 'O problema já foi removido'})
      }
      problema.active = false;
      await problema.save(trx);
      await trx.commit();
      return response.status(200).send({message: 'problema desativado'})

    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }
}

module.exports = ProblemaController

'use strict'

const ProblemaUnidade = use('App/Models/ProblemaUnidade');
const Database = use('Database');
const {validateAll} = use('Validator');

class ProblemaUnidadeController {
  /**
   * Show a list of all problemaunidades.
   * GET problemaunidades
   * ANCHOR INDEX
   */
  async index ({ request, response, view }) {
    try {
      //TODO innerJoin para pegar as informações do problema
      //NOTE quando essa função será utilizada?? necessária?
      const problemasUnidade = await Database
        .select('*')
        .table('problema_unidades')
        
      if(problemasUnidade.length == 0){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      response.status(200).send(problemasUnidade);
    } catch(error){
      response.status(400).send({error: `Erro: ${error.message}`})
    }
  }

  /**
   * Create/save a new problemaunidade.
   * POST problemaunidades
   * ANCHOR STORE
   */
  async store ({ request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(),{
        disciplina_ofertada_id: 'required|integer',
        problema_id: 'required|integer',
      })

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }

      const dataToCreate = request.all();
      const problemaUnidade = await ProblemaUnidade.create(dataToCreate,trx);
      await trx.commit();
      // return response.status(201).send({message: "problema da unidade criado com sucesso!"})
      return response.send(problemaUnidade)
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({ error: `Erro: ${error.message}`})
    }
  }

  /**
   * Display a single problemaunidade.
   * GET problemaunidades/:id
   * ANCHOR SHOW
   */
  async show ({ params, request, response, view }) {
    try {
      //TODO innerJoin para pegar as informações do problema
      const problemaUnidade = await Database
        .select('*')
        .table('problema_unidades')
        .where('id',params.id).first()

      if(!problemaUnidade){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      response.status(200).send(problemaUnidade)
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Update problemaunidade details.
   * PUT or PATCH problemaunidades/:id
   * ANCHOR UPDATE
   */
  async update ({ params, request, response }) {
    return response.status(501).send("Rota não implementada")
  }

  /**
   * Delete a problemaunidade with id.
   * DELETE problemaunidades/:id
   * ANCHOR DESTROY
   */
  async destroy ({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const problemaUnidade = await ProblemaUnidade.findBy('id', params.id);
      if(!problemaUnidade){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }

      await problemaUnidade.delete(trx);
      await trx.commit();
      return response.status(200).send({message: 'Problema da unidade excluído'})

    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }
}

module.exports = ProblemaUnidadeController

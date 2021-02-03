'use strict'

const Produto = use('App/Models/ProdutoProblema');
const Database = use('Database');
const {validateAll} = use('Validator')

class ProdutoProblemaController {

  /**
   * Create/save a new produtoproblema.
   * POST produtoproblemas
    * ANCHOR STORE
   */
  async store ({ request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(),{
        problema_id: 'required|integer',
        item_name: 'required|string',
        amount: 'required|integer'
      })

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }

      const dataToCreate = await request.all();
      const produto = await Produto.create(dataToCreate,trx);
      await trx.commit();
      return response.status(200).send(produto);
      // return response.status(200).send("O produto foi criado com sucesso!")
      
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({error: `Erro: ${error.message}`});
    }
  }

  /**
   * Display a single produtoproblema.
   * GET produtoproblemas/:id
    * ANCHOR SHOW
   */
  async show ({ params, request, response, }) {
    try {
      const produto = await Produto.findBy('id', params.id)
      if(!produto){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      return response.status(200).send(produto);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`)
    }
  }

  /**
   * Update produtoproblema details.
   * PUT or PATCH produtoproblemas/:id
   *
    * ANCHOR UPDATE
   */
  async update ({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(),{
        item_name: 'string',
        amount: 'integer'
      })

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }
      
      const dataToUpdate = request.all();
      const produto = await Produto.findBy('id', params.id)

      if(!produto){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }

      produto.merge({...dataToUpdate});
      produto.save(trx);
      await trx.commit();
      return response.status(200).send(produto)
      // return response.status(200).send("O produto foi modificado com sucesso!")
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({erro: `Erro: ${error.message}`})
    }
  }

  /**
   * Delete a produtoproblema with id.
   * DELETE produtoproblemas/:id
  * ANCHOR DESTROY
   */
  async destroy ({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const produto = await Produto.findBy('id', params.id)
      if(!produto){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      await produto.delete(trx)
      await trx.commit();
      return response.status(200).send("O produto do problema foi removido do sistema!");
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({erro: `Erro: ${error.message}`})
    }
  }
}

module.exports = ProdutoProblemaController

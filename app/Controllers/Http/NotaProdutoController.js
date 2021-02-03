'use strict'

const Nota = use('App/Models/NotaProduto');
const Database = use('Database');
const {validateAll} = use('Validator')

class NotaProdutoController {

  /**
   * Create/save a new notaproduto.
   * POST notaprodutos
   * ANCHOR STORE
   */
  async store ({ request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(),{
        produto: 'required|integer',
        grade: 'required|float',
      })

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }

      const dataToCreate = await request.all();
      const nota = await Nota.create(dataToCreate,trx);
      await trx.commit();
      return response.status(200).send(nota);
      // return response.status(200).send("A nota para o produto foi inserida com sucesso!")
      
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({error: `Erro: ${error.message}`});
    }
  }

  /**
   * Display a single notaproduto.
   * GET notaprodutos/:id
   * ANCHOR SHOW
   */
  async show ({ params, request, response, }) {
    try {
      const nota = await Nota.findBy('id', params.id)
      if(!nota){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      return response.status(200).send(nota);
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`)
    }
  }

  /**
   * Update notaproduto details.
   * PUT or PATCH notaprodutos/:id
   * ANCHOR UPDATE
   */
  async update ({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(),{
        grade: 'float',
      })

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }
      
      const dataToUpdate = request.all();
      const nota = await Nota.findBy('id', params.id)

      if(!nota){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }

      nota.merge({...dataToUpdate});
      nota.save(trx);
      await trx.commit();
      return response.status(200).send(nota)
      // return response.status(200).send("O nota foi modificado com sucesso!")
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({erro: `Erro: ${error.message}`})
    }
  }


  /**
   * Delete a notaproduto with id.
   * DELETE notaprodutos/:id
   * ANCHOR DESTROY
   */
  async destroy ({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const nota = await Nota.findBy('id', params.id)
      if(!nota){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      await nota.delete(trx)
      await trx.commit();
      return response.status(200).send("O nota do problema foi removido do sistema!");
    } catch (error) {
      await trx.rollback();
      return response.status(400).send({erro: `Erro: ${error.message}`})
    }
  }
}

module.exports = NotaProdutoController

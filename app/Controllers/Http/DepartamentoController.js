'use strict'

const Departamento = use('App/Models/Departamento');
const Database = use('Database')
const {validateAll} = use('Validator');

class DepartamentoController {
  /**
   * Show a list of all departamentos.
   * GET departamentos
   * ANCHOR INDEX
   */
  async index ({ request, response, auth }) {
    try {
      const departamentos = await Database.select('*').table(departamentos).where('active', true).where('id',params.id)
      if(departamentos.length == 0){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      return response.send(departamentos)
      
    } catch (error) {
      return response.status(500).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Create/save a new departamento.
   * POST departamentos
   * ANCHOR STORE
   */
  async store ({ request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(),{
        name: 'required',
        abbreviation: 'required|unique:departamentos,abbreviation',
      })

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }

      const dataToCreate = await request.all();
      const departamento = await Departamento.create(dataToCreate,trx);
      await trx.commit();
      // return response.status(200).send({message: "Departamento criado com sucesso!"})
      return response.send(departamento)
    } catch (error) {
      await trx.rollback();
      return response.status(500).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Display a single departamento.
   * GET departamentos/:id
   * ANCHOR SHOW
   */
  async show ({ params, request, response,  }) {
    try {
      const departamento = await Database.select('*').table('departamentos').where('active',true).where('id',params.id).first()
      if(!departamento){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      response.status(200).send(departamento)
    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }

  /**
   * Update departamento details.
   * PUT or PATCH departamentos/:id
   * ANCHOR UPDATE
   */
  async update ({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(),{
        abbreviation: 'unique:departamentos,abbreviation'
      })
  
      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }
  
      const dataToUpdate = request.all();
      const departamento = await Departamento.findBy('id', params.id)
  
      if(!departamento){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      departamento.merge({...dataToUpdate})
  
      await departamento.save(trx);
      await trx.commit();
      return response.status(201).send(departamento);
      // response.status(201).send({message: 'Informações alteradas com sucesso!'})
      } catch (error) {
        await trx.rollback();
        return response.status(400).send(`Erro: ${error.message}`)
      }
    
  }

  /**
   * Delete a departamento with id.
   * DELETE departamentos/:id
   * ANCHOR DESTROY
   */
  async destroy ({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const departamento = await Departamento.findBy('id', params.id);
      if(!departamento){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      else if(departamento.active == false){
        return response.status(406).send({message: 'O departamento já foi removido'})
      }
      departamento.active = false;
      await departamento.save(trx);
      await trx.commit();
      return response.status(200).send({message: 'Departamento desativado'})

    } catch (error) {
      return response.status(400).send(`Erro: ${error.message}`);
    }
  }
}

module.exports = DepartamentoController

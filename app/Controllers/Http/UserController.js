'use strict'

const User = use('App/Models/User');
const Aluno = use('App/Models/Aluno');
const Tutor = use('App/Models/Tutor');
const Adm = use('App/Models/Administrador');
const Database = use('Database')
const {validateAll} = use('Validator');

class UserController {
  /**
   * Show a list of all users.
   * GET users
   * ANCHOR INDEX
   */
  async index ({ request, response, auth }) {
    try{
      const users = await Database.select('*').table('users').where('active',true);
      if(users.length == 0){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      response.status(200).send(users);
    } catch(error){
      response.status(400).send({error: `Erro: ${error.message}`})
    }
  }

  /**
   * Create/save a new user.
   * POST users
   * ANCHOR STORE
   */
  async store ({ request, response }) {
    const trx = await Database.beginTransaction();
    try{
      const validation = await validateAll(request.all(), {
        username: 'required|unique:users,username',
        password: 'required|min:6|max:64',
        email: 'required|email|unique:users,email',
        enrollment: 'required|min:8|unique:users,enrollment',
        user_type: 'required',
        first_name: 'required',
        surname: 'required'
      })

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }

      const dataToCreate = request.only(['username','password','email','enrollment','user_type','first_name','surname']);
      const usuario = await User.create(dataToCreate,trx);

      // Relacionando o usuário ao seu tipo "Aluno, Tutor, ADM"
      if(usuario.user_type == 'aluno'){
        Aluno.create({user_id: usuario.id},trx)
      }
      if(usuario.user_type == 'tutor'){
        Tutor.create({user_id: usuario.id, isCoordenador:false},trx)
      }
      if(usuario.user_type == 'coordenador'){
        Tutor.create({user_id: usuario.id, isCoordenador: true},trx)
      }
      if(usuario.user_type == 'administrador'){
        Adm.create({user_id: usuario.id},trx)
      }
      await trx.commit();
      response.status(201).send({message: 'Usuário criado com sucesso'});
    }
    catch(error){
      await trx.rollback();
      return response.status(400).send({error: `Erro: ${error.message}`})
    }
  }

  /**
   * Display a single user.
   * GET users/:id
   * ANCHOR SHOW
   */
  async show ({ params, request, response, view }) {
    try{
      const user = await Database.select('*').table('users').where('active',true).where('id',params.id).first();
      if(!user){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      response.send(user);
    } catch(error){
      response.status(400).send({error: `Erro: ${error.message}`})
    }
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   * ANCHOR UPDATE
   */
  async update ({ params, request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const validation = await validateAll(request.all(), {
        username: 'unique:users,username',
        password: 'min:6|max:64',
        email: 'email|unique:users,email',
        enrollment: 'min:8|unique:users,enrollment',
      })

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }
      // const {username, password, email, enrollment, user_type, first_name, surname} = request.all();
      const dataToUpdate = request.all();
      const user = await User.findBy('id',params.id)
      if(!user){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      user.merge({...dataToUpdate});
      await user.save(trx);
      await trx.commit();
      return response.status(201).send({message: `Usuário alterado com sucesso `})

    } catch (error) {
      await trx.rollback();
      return response.status(400).send({error: `Erro: ${error.message}`});
    }
   
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   * ANCHOR DESTROY
   */
  async destroy ({ params, request, response }) {
    /*----------------------------------------------------------------
    DESATIVA O USUÁRIO
    ----------------------------------------------------------------*/
    const trx = await Database.beginTransaction();
    try {
      const user = await User.findBy('id',params.id)
      if(!user){
        return response.status(404).send({message: 'Nenhum registro localizado'})
      }
      else if(user.active == false){
        return response.status(406).send({message: 'O usuário já foi removido'})
      }
      user.active = false;
      await user.save(trx);
      await trx.commit();
      return response.status(200).send({message: 'Usuário Desativado'})
    } catch (error) {
      awaitrollback();
      return response.status(400).send(error)
    }
  }

}

module.exports = UserController

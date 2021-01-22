'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
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
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view, auth }) {
    // const tarefa = Database.select('titulo', 'descricao').from('tarefas').where('user_id', auth.user.id)
  }

  /**
   * Render a form to be used for creating a new user.
   * GET users/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
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
      const usuario = await User.create(dataToCreate);
      if(usuario.user_type == 'aluno'){
        Aluno.create({user_id: usuario.id})
        return response.send({message: 'Aluno cadastrado com sucesso'})
      }
      if(usuario.user_type == 'tutor'){
        Tutor.create({user_id: usuario.id, isCoordenador:false})
        return response.send({message: 'Tutor cadastrado com sucesso'})
      }
      if(usuario.user_type == 'coordenador'){
        Tutor.create({user_id: usuario.id, isCoordenador: true})
        return response.send({message: 'Coordenador cadastrado com sucesso'})
      }
      if(usuario.user_type == 'administrador'){
        Adm.create({user_id: usuario.id})
        return response.send({message: 'Administrador cadastrado com sucesso'})
      }

    }
    catch(error){
      return response.status(500).send({error: `Erro: ${error.message}`});
    }
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing user.
   * GET users/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const {titulo, descricao} = request.all();

    const tarefa = await Tarefa.query().where('id',params.id).where('user_id','=',auth.user.id).first();
    if(!tarefa){
      return response.status(404).send({message: 'Nenhum registro localizado'})
    }

    tarefa.titulo = titulo;
    tarefa.descricao = descricao;
    tarefa.id = params.id;

    await tarefa.save();
    return tarefa
  }

  async destroy ({ params, request, response }) {
    // const tarefa = await Tarefa.query().where('id',params.id).where('user_id','=',auth.user.id).first();
    // if(!tarefa){
    //   return response.status(404).send({message: 'Nenhum registro localizado'})
    // }

    // await tarefa.delete();
    // return response.status(200).send({message: 'Registro removido'})
  
    /*----------------------------------------------------------------
    DESATIVA O USUÁRIO
    ----------------------------------------------------------------*/
    try {
      const user = await User.findBy('id',params.id);
      user.active = false;
      await user.save();
      return response.status(200).send({message: 'Usuário Desativado'})
    } catch (error) {
      return response.status(500).send(error)
    }
  }

  async login ({auth, request, response}){
    try {
      const {username, password, email} = request.all();
      const validaToken = await auth.attempt(email,password)
      // if(username == null)
      //    validaToken = await auth.attempt(email,password)
      // else if(email == null)
      //    validaToken = await auth.attempt(username,password)
      return validaToken
    } catch (error) {
      return response.status(500).send({error: `Erro: ${error.message}`})
    }
  }
}

module.exports = UserController

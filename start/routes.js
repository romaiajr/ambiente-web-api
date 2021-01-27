'use strict'

const { RouteResource } = require('@adonisjs/framework/src/Route/Manager')

/*
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

//ANCHOR USER ROUTES
Route.resource('/users','UserController').apiOnly();
// Route.post('/users','UserController.store');
// Route.get('/users','UserController.index');
// Route.get('/users/:id','UserController.show');
// Route.delete('/users/:id','UserController.destroy');
// Route.resource('/tarefa','TarefaController').apiOnly().middleware('auth')

//ANCHOR AUTH ROUTES
Route.post('/login','AuthController.login');

//ANCHOR ALUNO ROUTES
Route.resource('/alunos','AlunoController').apiOnly();

//ANCHOR ADM ROUTES
Route.resource('/administradores','AdministradorController').apiOnly();

//ANCHOR TUTOR ROUTES
Route.resource('/tutores','TutorController').apiOnly();

//ANCHOR DEPARTAMENTO routes
Route.resource('/departamentos','DepartamentoController').apiOnly();

//ANCHOR SEMESTRES routes
Route.resource('/semestres','SemestreController').apiOnly();
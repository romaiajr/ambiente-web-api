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
Route.get('/disciplinas-departamento/:id','DepartamentoController.getDisciplinas');

//ANCHOR SEMESTRES routes
Route.resource('/semestres','SemestreController').apiOnly();
Route.get('/disciplinas-ofertadas-semestre/:id','SemestreController.getDisciplinasOfertadas');

//ANCHOR DISCIPLINA ROUTES
Route.resource('/disciplinas','DisciplinaController').apiOnly();

//ANCHOR DISCIPLINA OFERTADA routes
Route.resource('/disciplinas-ofertadas','DisciplinaOfertadaController').apiOnly();

//ANCHOR PROBLEMA ROUTES
Route.resource('/problemas','ProblemaController').apiOnly();
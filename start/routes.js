'use strict'

const { RouteResource } = require('@adonisjs/framework/src/Route/Manager')

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
Route.get('/disciplinas-ofertadas-semestre/:id','SemestreController.getDisciplinasOfertadas'); //NOTE Mudar o nome da rota?

//ANCHOR DISCIPLINA ROUTES
Route.resource('/disciplinas','DisciplinaController').apiOnly();
Route.get('/disciplinas-problemas/:id','DisciplinaController.getProblemas') //NOTE Mudar o nome da rota?

//ANCHOR DISCIPLINA OFERTADA routes
Route.resource('/disciplinas-ofertadas','DisciplinaOfertadaController').apiOnly();
Route.get('/disciplinas-ofertadas-problemas/:id','DisciplinaOfertadaController.getProblemas'); //NOTE Mudar o nome da rota?

//ANCHOR PROBLEMA ROUTES
Route.resource('/problemas','ProblemaController').apiOnly();

//ANCHOR PROBLEMA UNIDADES ROUTES
Route.resource('/problemas-unidades','ProblemaUnidadeController').apiOnly();

//ANCHOR REQUISITO PROBLEMA ROUTES
Route.resource('/requisito-problema','RequisitoProblemaController').apiOnly();

//ANCHOR OBJETIVO PROBLEMA ROUTES
Route.resource('/objetivo-problema','ObjetivoProblemaController').apiOnly();

//ANCHOR PRODUTO PROBLEMA routes
Route.resource('/produto-problema','ProdutoProblemaController').apiOnly();

//ANCHOR NOTA PRODUTO ROUTES
Route.resource('/nota-produto','NotaProdutoController').apiOnly();

//ANCHOR TURMA routes
Route.resource('/turmas','TurmaController').apiOnly();

//ANCHOR TURMA routes
Route.resource('/turma-aluno','TurmaAlunoController').apiOnly();
'use strict'

const { RouteResource } = require('@adonisjs/framework/src/Route/Manager')

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

//ANCHOR USER ROUTES
Route.resource('/users','UserController').apiOnly();
Route.get('/users-by-type/:type', 'UserController.getByType')
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
Route.resource('/departamentos','DepartamentoController').apiOnly().middleware('auth');
Route.get('/disciplinas-departamento/:id','DepartamentoController.getDisciplinas').middleware('auth');

//ANCHOR SEMESTRES routes
Route.resource('/semestres','SemestreController').apiOnly().middleware('auth');
Route.get('/disciplinas-ofertadas-semestre/:id','SemestreController.getDisciplinasOfertadas').middleware('auth'); //NOTE Mudar o nome da rota?

//ANCHOR DISCIPLINA ROUTES
Route.resource('/disciplinas','DisciplinaController').apiOnly().middleware('auth');
Route.get('/disciplinas-problemas/:id','DisciplinaController.getProblemas').middleware('auth'); //NOTE Mudar o nome da rota?

//ANCHOR DISCIPLINA OFERTADA routes
Route.resource('/disciplinas-ofertadas','DisciplinaOfertadaController').apiOnly().middleware('auth');
Route.get('/disciplinas-ofertadas-problemas/:id','DisciplinaOfertadaController.getProblemas').middleware('auth'); //NOTE Mudar o nome da rota?

//ANCHOR PROBLEMA ROUTES
Route.resource('/problemas','ProblemaController').apiOnly().middleware('auth');

//ANCHOR PROBLEMA UNIDADES ROUTES
Route.resource('/problemas-unidades','ProblemaUnidadeController').apiOnly().middleware('auth');

//ANCHOR REQUISITO PROBLEMA ROUTES
Route.resource('/requisito-problema','RequisitoProblemaController').apiOnly().middleware('auth');

//ANCHOR OBJETIVO PROBLEMA ROUTES
Route.resource('/objetivo-problema','ObjetivoProblemaController').apiOnly().middleware('auth');

//ANCHOR PRODUTO PROBLEMA routes
Route.resource('/produto-problema','ProdutoProblemaController').apiOnly().middleware('auth');

//ANCHOR NOTA PRODUTO ROUTES
Route.resource('/nota-produto','NotaProdutoController').apiOnly().middleware('auth');

//ANCHOR TURMA routes
Route.resource('/turmas','TurmaController').apiOnly().middleware('auth');
Route.get('/turma-tutor/:id', "TurmaController.getTutores").middleware('auth');

//ANCHOR TURMA ALUNO routes
Route.resource('/turma-aluno','TurmaAlunoController').apiOnly().middleware('auth');

// TURMA TUTOR routes
Route.resource('/turma-tutor','TurmaTutorController').apiOnly().middleware('auth');

// LOG routes
Route.resource('/system-logs', 'SystemLogController').apiOnly().middleware('auth')

// BAREMA routes
Route.resource('/barema-tutor','BaremaController').apiOnly().middleware('auth')
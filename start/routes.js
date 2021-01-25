'use strict'

const { RouteResource } = require('@adonisjs/framework/src/Route/Manager')

/*
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.resource('/users','UserController').apiOnly();
// Route.post('/users','UserController.store')
// Route.post('/login','UserController.login');
Route.delete('/users/:id','UserController.destroy');
// Route.resource('/tarefa','TarefaController').apiOnly().middleware('auth')

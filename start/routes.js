'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

var timestamp = (new Date());

Route.get('/', () => {
  return { greeting: 'SERVER IS RUNNING...'+timestamp }
})

Route.post('/user', 'UserController.create');
Route.post('/login', 'UserController.login');
Route.get('/user/:id', 'UserController.show');

Route.resource('tarefa', 'TarefaController').apiOnly().middleware('auth');

Route.post('/tarefa/:id/arquivo', 'ArquivoController.create').middleware('auth');
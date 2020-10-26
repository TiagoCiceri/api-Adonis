'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

var timestamp = (new Date());

Route.get('/', () => {
  return { greeting: 'SERVER IS RUNNING...'+timestamp }
})

Route.post('/user', 'UserController.create');
Route.post('/login', 'UserController.login');

Route.resource('tarefa', 'TarefaController').apiOnly().middleware('auth');
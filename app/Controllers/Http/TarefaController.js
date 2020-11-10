'use strict'

const Tarefa = use('App/Models/Tarefa');
const Database = use('Database');
const { validadeAll } = use('Validator');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tarefas
 */
class TarefaController {
  /**
   * Show a list of all tarefas.
   * GET tarefas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view, auth }) {
    //const tarefas = await Tarefa.all();
    const tarefas = await Tarefa.query()
                                //.select('titulo', 'descricao')
                                .where('user_id', auth.user.id)
                                .withCount('arquivos as total_arquivos')
                                .fetch();
    //const tarefas = Database.select('titulo', 'descricao')
    //                       .from('tarefas')
    //                       .where('user_id', auth.user.id);

    return tarefas;
  }

    /**
   * Create/save a new tarefa.
   * POST tarefas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    try {
      const {id} = auth.user;    
      
      const data = request.only(["titulo", "descricao"]);
      
      const tarefa = await Tarefa.create({...data, user_id: id})

      return tarefa;  
    } catch(err) {
      return response.status(500).send({message: `Erro: ${err.message}`})
    }
  }

  /**
   * Display a single tarefa.
   * GET tarefas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view, auth }) { 
    const tarefa = Tarefa.query()
                         //.select('titulo', 'descricao')
                         .where('user_id', auth.user.id)
                         .where('id', '=', params.id)
                         .first();

    if (!tarefa) {
      return response.status(401).send({message: 'Nenhum tarefa foi localizada.'});
    }

    //await tarefa.load('arquivos');

    return tarefa;
  }

  /**
   * Update tarefa details.
   * PUT or PATCH tarefas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const { titulo, descricao } = request.all();

    const tarefa = await Tarefa.query()
                               .where('user_id', auth.user.id)
                               .where('id', '=', params.id)
                               .first();
          
    if (!tarefa) {
      return response.status(401).send({message: 'Nenhum registro localizado.'});
    }

    tarefa.titulo = titulo;
    tarefa.descricao = descricao;
    tarefa.id = params.id;

    await tarefa.save();

    return tarefa;
  }

  /**
   * Delete a tarefa with id.
   * DELETE tarefas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, auth }) {
    const tarefa = await Tarefa.query()
                               .where('user_id', auth.user.id)
                               .where('id','=',params.id)
                               .first();

    if (!tarefa) {
      return response.status(404).send({message: 'Nenhum registro localizado.'});
    }

    await tarefa.delete();

    return response.status(200).send({message: 'Registro removiso com sucesso!!!'});
  }  
}

module.exports = TarefaController

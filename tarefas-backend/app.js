const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const Tarefa = db.Tarefa;
// Rota para criar tarefa
app.post('/tarefas'
    , async (req, res) => {
        const { descricao, concluida } = req.body;
        const novaTarefa = await Tarefa.create({ descricao, concluida });
        res.json(novaTarefa);
    });
// Rota para listar todas as tarefas
app.get('/tarefas'
    , async (req, res) => {
        const tarefas = await Tarefa.findAll();
        res.json(tarefas);
    });
// Rota para atualizar uma tarefa
app.put('/tarefas/:id'
    , async (req, res) => {
        const { id } = req.params;
        const { descricao, concluida } = req.body;
        await Tarefa.update({ descricao, concluida }, { where: { id } });
        res.json({ message: "Tarefa atualizada com sucesso!" });
    });
// Rota para excluir uma tarefa
app.delete('/tarefas/:id'
    , async (req, res) => {
        const { id } = req.params;
        await Tarefa.destroy({ where: { id } });
        res.json({ message: "Tarefa excluída com sucesso!" });
    });
app.listen(3001, () => console.log('Servidor backend rodando na porta 3001'));
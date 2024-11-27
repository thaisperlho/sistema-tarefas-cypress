import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Página de Cadastro de Tarefas
function CadastroTarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [concluida, setConcluida] = useState(false);
  const [editingTask, setEditingTask] = useState(null);


  // Carregar tarefas
  useEffect(() => {
    axios.get('http://localhost:3001/tarefas').then((response) => {
      setTarefas(response.data);
    });
  }, []);

  // Adicionar nova tarefa
  const addTarefa = () => {
    axios
      .post('http://localhost:3001/tarefas', { descricao, concluida })
      .then((response) => {
        setTarefas([...tarefas, response.data]);
        setDescricao('');
        setConcluida(false);
      });
  };

  const updateTarefa = () => {
    axios
      .put(`http://localhost:3001/tarefas/${editingTask.id}`, {
        descricao: editingTask.descricao,
        concluida: editingTask.concluida,
      })
      .then(() => {
        setTarefas((prev) =>
          prev.map((tarefa) =>
            tarefa.id === editingTask.id ? editingTask : tarefa
          )
        );
        setEditingTask(null);
      });
  };
  const deleteTarefa = (id) => {
    axios.delete(`http://localhost:3001/tarefas/${id}`).then(() => {
      setTarefas((prev) => prev.filter((tarefa) => tarefa.id !== id));
    });
  };


  return (
    <div className="app-container">
      <h2>Cadastro de Tarefas</h2>
      <input
        id='descricao'
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <label>
        <label class="checkbox-container">
          <input
            type="checkbox"
            checked={concluida}
            onChange={() => setConcluida(!concluida)}
          />
          <span>Marcar como concluída</span>
        </label>

      </label>
      <button className="add-task" onClick={addTarefa}>Adicionar Tarefa</button>
      <h3>Lista de Tarefas</h3>
      <ul>
        {tarefas.map((tarefa) => (
          <li key={tarefa.id} className="task-item">
            {editingTask && editingTask.id === tarefa.id ? (
              <>
                <input
                  id="editardescriacao"
                  type="text"
                  value={editingTask.descricao}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, descricao: e.target.value })
                  }
                />
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={editingTask.concluida}
                    onChange={() =>
                      setEditingTask({
                        ...editingTask,
                        concluida: !editingTask.concluida,
                      })
                    }
                  />
                  <span className='editspan'>Concluir tarefa</span>
                </label>
                <button className="save-task" onClick={updateTarefa}>
                  Salvar
                </button>
                <button className="cancel-task" onClick={() => setEditingTask(null)}>
                  Cancelar
                </button>

              </>
            ) : (
              <>
                <span className={tarefa.concluida ? 'completed' : 'pending'}>
                  {tarefa.descricao} -{' '}
                  {tarefa.concluida ? 'Concluída' : 'Pendente'}
                </span>
                <div className="actions">
                  <button className="edit-task" onClick={() => setEditingTask(tarefa)}>
                    <i className="fas fa-edit"></i> Editar
                  </button>

                  <button className="delete-task" onClick={() => deleteTarefa(tarefa.id)}>
                    <i className="fas fa-trash"></i> Excluir
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

    </div>
  );
}

// Componente principal com o roteamento
function App() {
  return (
    <Router>
      <Routes>
        {/* Redireciona da rota "/" para "/cadastro-tarefas" */}
        <Route path="/" element={<Navigate to="/cadastro-tarefas" />} />
        <Route path="/cadastro-tarefas" element={<CadastroTarefas />} />
      </Routes>
    </Router>
  );
}

export default App;

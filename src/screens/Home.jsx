import { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Importa a função v4 do uuid
import Header from "../components/Header";
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal"; // Modal de confirmação de exclusão

function Home() {
  const [tasks, setTasks] = useState([
    { id: uuidv4(), title: "Estudar React", description: "Revisar componentes e hooks", completed: false },
    { id: uuidv4(), title: "Criar layout do Task Flow", description: "Melhorar interface e design", completed: false },
    { id: uuidv4(), title: "Assistir aula de microeletrônica", description: "Capítulo 2 - Amplificadores", completed: false },
  ]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [isAddingTask, setIsAddingTask] = useState(false); // Controla o modal de adicionar tarefa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState({ id: null, title: "" }); // Armazena id e nome da tarefa
  const [showCompleted, setShowCompleted] = useState(false); // Controla qual lista de tarefas é exibida

  const addTask = (title, description) => {
    const newTask = {
      id: uuidv4(), // Gera um id único usando uuid
      title,
      description,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTask({ title: "", description: "" }); // Limpa o formulário
    setIsAddingTask(false); // Fecha o modal de adicionar tarefa
  };

  const openDeleteModal = (id) => {
    const task = tasks.find(task => task.id === id); // Obtém a tarefa pelo id
    setTaskToDelete({ id, title: task.title }); // Armazena o id e título da tarefa
    setIsModalOpen(true); // Abre o modal
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false); // Fecha o modal
    setTaskToDelete({ id: null, title: "" }); // Reseta a tarefa selecionada
  };

  const confirmDelete = () => {
    const newTasks = tasks.filter(task => task.id !== taskToDelete.id);
    setTasks(newTasks);
    closeDeleteModal(); // Fecha o modal após a confirmação
  };

  const completeTask = (id) => {
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredTasks = tasks.filter(task => showCompleted ? task.completed : !task.completed);

  return (
    <div className="bg-dark min-h-screen text-white">
      <Header setIsAddingTask={setIsAddingTask} />
      <div className="container mx-auto p-6">
        <h2 className="text-4xl font-semibold text-center mb-8 text-lightYellow">Minhas Tarefas</h2>

        {/* Botões de filtro */}
        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={() => setShowCompleted(false)}
            className={`px-6 py-3 rounded-xl transition duration-300 transform ${!showCompleted ? 'bg-tealLight text-dark' : 'bg-gray-700 text-white'} hover:scale-105`}
          >
            Tarefas à Concluir
          </button>
          <button
            onClick={() => setShowCompleted(true)}
            className={`px-6 py-3 rounded-xl transition duration-300 transform ${showCompleted ? 'bg-tealLight text-dark' : 'bg-gray-700 text-white'} hover:scale-105`}
          >
            Tarefas Concluídas
          </button>
        </div>

        {/* Modal de Adicionar Tarefa */}
        {isAddingTask && (
          <Modal
            message="Adicionar Nova Tarefa"
            onConfirm={() => addTask(newTask.title, newTask.description)}
            onCancel={() => setIsAddingTask(false)}
            modalContent={
              <>
                <input
                  type="text"
                  name="title"
                  placeholder="Título"
                  value={newTask.title}
                  onChange={handleFormChange}
                  maxLength={50}
                  className="bg-dark text-lightYellow p-3 mb-4 w-full border-b-2 border-tealLight focus:outline-none text-xl"
                />
                <textarea
                  name="description"
                  placeholder="Descrição"
                  value={newTask.description}
                  onChange={handleFormChange}
                  maxLength={80}
                  rows="3"
                  className="bg-dark text-lightYellow p-3 mb-4 w-full border-b-2 border-tealLight focus:outline-none text-lg"
                />
              </>
            }
          />
        )}

        {/* Exibe as tarefas filtradas */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={() => openDeleteModal(task.id)} // Passa o id da tarefa
              onComplete={() => completeTask(task.id)} // Passa o id da tarefa
              className={`${
                task.completed ? 'bg-tealDark text-lightYellow' : 'bg-gray-800 text-white'
              } p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300`}
            />
          ))}
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      {isModalOpen && (
        <Modal
          message={`Você tem certeza que deseja excluir a tarefa: "${taskToDelete.title}"?`}
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </div>
  );
}

export default Home;

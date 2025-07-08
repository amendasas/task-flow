import { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Importa a função v4 do uuid
import Header from "../components/Header";
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal"; // Modal de confirmação de exclusão

function Home() {
  // Estado para gerenciar as tarefas
  const [tasks, setTasks] = useState([
    { id: uuidv4(), title: "Estudar React", description: "Revisar componentes e hooks", completed: false, dueDate: "2025-12-31", completedDate: null },
    { id: uuidv4(), title: "Criar layout do Task Flow", description: "Melhorar interface e design", completed: false, dueDate: "2025-11-15", completedDate: null },
    { id: uuidv4(), title: "Assistir aula de microeletrônica", description: "Capítulo 2 - Amplificadores", completed: false, dueDate: "2025-10-30", completedDate: null },
  ]);

  // Estado para o formulário de nova tarefa
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });

  // Estados para controlar modais e filtros
  const [isAddingTask, setIsAddingTask] = useState(false); // Modal de adicionar tarefa
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal de confirmação de exclusão
  const [taskToDelete, setTaskToDelete] = useState({ id: null, title: "" }); // Tarefa a ser excluída
  const [showCompleted, setShowCompleted] = useState(false); // Filtro de tarefas concluídas
  const [titleError, setTitleError] = useState(false);
  const [dueDateError, setDueDateError] = useState(false);

 // Função para adicionar uma nova tarefa
  const addTask = (title, description, dueDate) => {
    const isTitleEmpty = title.trim() === "";
    const isDateEmpty = dueDate.trim() === "";

    // Validação visual já está no modal, não precisa de alert
    setTitleError(isTitleEmpty);
    setDueDateError(isDateEmpty);

    if (isTitleEmpty || isDateEmpty) {
      return; // Não adiciona se título ou data estiverem vazios
    }

    const novaTarefa = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(), // Descrição pode estar vazia
      dueDate,
      completed: false,
      completedDate: null,
    };

    setTasks([...tasks, novaTarefa]);
    setNewTask({ title: "", description: "", dueDate: "" }); // Limpa os campos
    setIsAddingTask(false); // Fecha o modal
  };


  // Função para abrir o modal de exclusão
  const openDeleteModal = (id) => {
    const task = tasks.find(task => task.id === id); // Encontra a tarefa pelo id
    setTaskToDelete({ id, title: task.title }); // Armazena o id e título da tarefa
    setIsModalOpen(true); // Abre o modal
  };

  // Função para fechar o modal de exclusão
  const closeDeleteModal = () => {
    setIsModalOpen(false); // Fecha o modal
    setTaskToDelete({ id: null, title: "" }); // Reseta a tarefa selecionada
  };

  // Função para confirmar a exclusão de uma tarefa
  const confirmDelete = () => {
    const newTasks = tasks.filter(task => task.id !== taskToDelete.id); // Filtra a tarefa excluída
    setTasks(newTasks);
    closeDeleteModal(); // Fecha o modal
  };

  // Função para marcar/desmarcar uma tarefa como concluída
  const completeTask = (id) => {
    const newTasks = tasks.map(task =>
      task.id === id
        ? {
            ...task,
            completed: !task.completed,
            completedDate: !task.completed
              ? new Date(Date.now()).toISOString().split("T")[0] // Usa a data UTC
              : null,
          }
        : task
    );
    setTasks(newTasks);
  };

  // Função para atualizar os campos do formulário
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filtra as tarefas com base no estado "showCompleted"
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
            onConfirm={() => {
              const isTitleEmpty = newTask.title.trim() === "";
              const isDateEmpty = newTask.dueDate.trim() === "";

              setTitleError(isTitleEmpty);
              setDueDateError(isDateEmpty);

              if (isTitleEmpty || isDateEmpty) {
                return; // Não prossegue se houver erro
              }

              addTask(newTask.title, newTask.description, newTask.dueDate);
            }}
            onCancel={() => {
              setIsAddingTask(false);
              setNewTask({ title: "", description: "", dueDate: "" }); // Reseta os campos ao cancelar
            }}
            modalContent={
              <>
                <input
                  type="text"
                  name="title"
                  placeholder="Título"
                  value={newTask.title}
                  onChange={(e) => {
                    handleFormChange(e);
                    setTitleError(false); // Limpa erro ao digitar
                  }}
                  maxLength={50}
                  className={`bg-dark text-lightYellow p-3 mb-2 w-full border-b-2 focus:outline-none text-xl transition-all duration-300
                    ${titleError ? "border-red-500 animate-shake" : "border-tealLight"}
                  `}
                />
                <div className="text-right text-sm text-gray-500 mb-4">
                  {newTask.title.length}/50
                </div>
                <textarea
                  name="description"
                  placeholder="Descrição"
                  value={newTask.description}
                  onChange={handleFormChange}
                  onInput={(e) => {
                    e.target.style.height = "auto"; // Reseta a altura antes de calcular
                    e.target.style.height = `${e.target.scrollHeight}px`; // Ajusta a altura conforme o conteúdo
                  }}
                  maxLength={80}
                  rows="1"
                  className="bg-dark text-lightYellow p-3 mb-2 w-full border-b-2 border-tealLight focus:outline-none text-lg overflow-hidden resize-none"
                />
                <div className="text-right text-sm text-gray-500 mb-4">
                  {newTask.description.length}/80
                </div>
                <div className="mb-4">
                  <p className="text-xl font-semibold text-lightYellow mb-4">Quando deve concluir essa tarefa?</p>
                  <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={(e) => {
                      handleFormChange(e);
                      setDueDateError(false); // Limpa erro ao alterar data
                    }}
                    className={`bg-dark text-lightYellow p-3 mb-2 w-full border-b-2 focus:outline-none text-lg transition-all duration-300
                      ${dueDateError ? "border-red-500 animate-shake" : "border-tealLight"}
                    `}
                  />
                </div>
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
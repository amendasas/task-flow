import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "../components/Header";
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal";
import Footer from "../components/Footer";
import { useTaskStorage } from "../hooks/useLocalStorage";
import { useToast } from "../components/Toast";

function Home() {
  // Tarefas padrão apenas para primeira execução
  const defaultTasks = [
    { 
      id: uuidv4(), 
      title: "Bem-vindo ao Task Flow!", 
      description: "Esta é uma tarefa de exemplo. Você pode editá-la ou excluí-la.", 
      completed: false, 
      dueDate: "2025-12-31", 
      completedDate: null,
      createdAt: new Date().toISOString()
    }
  ];

  // Hook personalizado para gerenciar tarefas com localStorage
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTaskStorage(defaultTasks);
  
  // Hook para notificações
  const { showToast, ToastContainer } = useToast();

  // Estados do formulário e UI
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState({ id: null, title: "" });
  const [showCompleted, setShowCompleted] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [dueDateError, setDueDateError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [pastDateError, setPastDateError] = useState(false);
  
  // Estado para controlar o tipo de ordenação
  const [sortType, setSortType] = useState('priority'); // 'priority' ou 'creation'

  // Função para calcular os dias restantes
  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - today;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24) + 1);
    return daysRemaining;
  };

  // Função para determinar a prioridade da tarefa
  const getTaskPriority = (task) => {
    if (task.completed) return 0; // Tarefas concluídas têm prioridade baixa
    
    const daysRemaining = calculateDaysRemaining(task.dueDate);
    
    if (daysRemaining < 0) return 5; // Atrasadas - prioridade máxima
    if (daysRemaining === 0) return 4; // Vence hoje - prioridade alta
    if (daysRemaining <= 3) return 3; // Vence em poucos dias - prioridade média-alta
    if (daysRemaining <= 7) return 2; // Vence na próxima semana - prioridade média
    return 1; // Outras - prioridade baixa
  };

  // Função para ordenar tarefas por prioridade
  const sortTasksByPriority = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      const priorityA = getTaskPriority(a);
      const priorityB = getTaskPriority(b);
      
      // Se as prioridades forem diferentes, ordena por prioridade (maior primeiro)
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }
      
      // Se as prioridades forem iguais, ordena por data de vencimento (mais próxima primeiro)
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA - dateB;
    });
  };

  // Função para ordenar tarefas por data de criação
  const sortTasksByCreation = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      // Tarefas concluídas vão para o final
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      
      // Ordena por data de criação (mais recentes primeiro)
      const dateA = new Date(a.createdAt || a.id); // Fallback para ID se não tiver createdAt
      const dateB = new Date(b.createdAt || b.id);
      return dateB - dateA;
    });
  };

  // Função principal de ordenação
  const sortTasks = (tasksToSort) => {
    if (sortType === 'priority') {
      return sortTasksByPriority(tasksToSort);
    } else {
      return sortTasksByCreation(tasksToSort);
    }
  };

  // Função para alternar tipo de ordenação
  const toggleSortType = () => {
    const newSortType = sortType === 'priority' ? 'creation' : 'priority';
    setSortType(newSortType);
    
    // Notificação sobre a mudança
    const message = newSortType === 'priority' 
      ? 'Ordenação alterada para: Prioridade'
      : 'Ordenação alterada para: Data de criação';
    showToast(message, 'info');
  };

  // Função para validar o formulário
  const validateForm = () => {
    const isTitleEmpty = newTask.title.trim() === "";
    const isDateEmpty = newTask.dueDate.trim() === "";

    setTitleError(isTitleEmpty);
    setDueDateError(isDateEmpty);

    if (isTitleEmpty || isDateEmpty) {
      return false;
    }

    // Normaliza a data atual para o início do dia em UTC
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    // O construtor new Date('AAAA-MM-DD') já interpreta a string como UTC.
    const taskDueDate = new Date(newTask.dueDate);

    const isPastDate = taskDueDate.getTime() < todayUTC.getTime();
    setPastDateError(isPastDate);

    return !isPastDate;
  };

  // Função para adicionar uma nova tarefa
  const handleAddTask = () => {
    if (!validateForm()) return;

    const novaTarefa = {
      id: uuidv4(),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      dueDate: newTask.dueDate,
      completed: false,
      completedDate: null,
      createdAt: new Date().toISOString()
    };

    addTask(novaTarefa);
    setNewTask({ title: "", description: "", dueDate: "" });
    setIsAddingTask(false);
    
    // Notificação de sucesso
    showToast(`Tarefa "${novaTarefa.title}" criada com sucesso!`, 'success');
  };

  // Função para atualizar uma tarefa
  const handleUpdateTask = () => {
    if (!validateForm()) return;

    const updatedTaskData = {
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      dueDate: newTask.dueDate,
      updatedAt: new Date().toISOString()
    };

    updateTask(taskToEdit.id, updatedTaskData);
    setIsEditing(false);
    setTaskToEdit(null);
    setNewTask({ title: "", description: "", dueDate: "" });
    
    // Notificação de sucesso
    showToast(`Tarefa "${updatedTaskData.title}" atualizada com sucesso!`, 'success');
  };

  const openDeleteModal = (id) => {
    const task = tasks.find(task => task.id === id);
    setTaskToDelete({ id, title: task.title });
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setTaskToDelete({ id: null, title: "" });
  };

  const confirmDelete = () => {
    deleteTask(taskToDelete.id);
    closeDeleteModal();
    
    // Notificação de sucesso
    showToast(`Tarefa "${taskToDelete.title}" excluída com sucesso!`, 'success');
  };

  const handleCompleteTask = (id) => {
    const task = tasks.find(t => t.id === id);
    toggleTaskCompletion(id);
    
    // Notificação baseada na ação
    if (task.completed) {
      showToast(`Tarefa "${task.title}" reaberta!`, 'info');
    } else {
      showToast(`Parabéns! Tarefa "${task.title}" concluída!`, 'success');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const startEditingTask = (task) => {
    setTaskToEdit(task);
    setNewTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setNewTask({ title: "", description: "", dueDate: "" });
    setTitleError(false);
    setDueDateError(false);
    setPastDateError(false);
  };

  // Filtrar e ordenar tarefas
  const filteredTasks = tasks.filter(task => showCompleted ? task.completed : !task.completed);
  const sortedTasks = sortTasks(filteredTasks);

  // Estatísticas das tarefas
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => {
      if (t.completed) return false;
      return calculateDaysRemaining(t.dueDate) < 0;
    }).length
  };

  const formContent = (
    <div className="space-y-6">
      {/* Campo de título com melhor design */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-lightYellow">
          Título da Tarefa
        </label>
        <input
          type="text"
          name="title"
          placeholder="Digite o título da tarefa..."
          value={newTask.title}
          onChange={(e) => {
            handleFormChange(e);
            setTitleError(false);
          }}
          maxLength={50}
          className={`w-full p-4 bg-gray-800 text-white rounded-xl border-2 focus:outline-none text-lg transition-all duration-300 placeholder-gray-400 ${
            titleError ? "border-red-500 animate-pulse" : "border-gray-600 focus:border-tealLight"
          }`}
        />
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {titleError && <span className="text-red-400">Título é obrigatório</span>}
          </div>
          <div className="text-sm text-gray-400">
            {newTask.title.length}/50
          </div>
        </div>
      </div>

      {/* Campo de descrição com melhor design */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-lightYellow">
          Descrição (Opcional)
        </label>
        <textarea
          name="description"
          placeholder="Adicione uma descrição detalhada..."
          value={newTask.description}
          onChange={handleFormChange}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          maxLength={150}
          rows="3"
          className="w-full p-4 bg-gray-800 text-white rounded-xl border-2 border-gray-600 focus:border-tealLight focus:outline-none text-lg overflow-hidden resize-none placeholder-gray-400 transition-all duration-300"
        />
        <div className="text-right text-sm text-gray-400">
          {newTask.description.length}/150
        </div>
      </div>

      {/* Campo de data com melhor design */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-lightYellow">
          Data de Vencimento
        </label>
        <input
          type="date"
          name="dueDate"
          value={newTask.dueDate}
          onChange={(e) => {
            handleFormChange(e);
            setDueDateError(false);
            setPastDateError(false);
          }}
          className={`w-full p-4 bg-gray-800 text-white rounded-xl border-2 focus:outline-none text-lg transition-all duration-300 ${
            dueDateError || pastDateError ? "border-red-500 animate-pulse" : "border-gray-600 focus:border-tealLight"
          }`}
        />
        <div className="text-sm">
          {dueDateError && <span className="text-red-400">Data é obrigatória</span>}
          {pastDateError && <span className="text-red-400">Escolha uma data futura ou atual</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header setIsAddingTask={setIsAddingTask} />
      
      {/* Container de notificações */}
      <ToastContainer />
      
      {/* Container principal com melhor espaçamento */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Cabeçalho da seção com estatísticas */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-lightYellow to-tealLight bg-clip-text text-transparent mb-4">
            Minhas Tarefas
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-tealLight to-tealDark rounded-full mx-auto mb-6"></div>
          
          {/* Botão de ordenação */}
          <div className="mb-6">
            <button
              onClick={toggleSortType}
              className="group inline-flex items-center space-x-3 bg-gray-800/50 hover:bg-gray-700/50 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 text-tealLight transition-transform group-hover:rotate-180 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span className="text-gray-300 text-sm font-medium">
                {sortType === 'priority' 
                  ? 'Ordenado por prioridade' 
                  : 'Ordenado por data de criação'
                }
              </span>
              <svg className="w-4 h-4 text-gray-400 transition-transform group-hover:translate-x-1 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>
          
          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-gray-800/50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-white">{taskStats.total}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
            <div className="bg-green-500/20 p-4 rounded-xl">
              <div className="text-2xl font-bold text-green-400">{taskStats.completed}</div>
              <div className="text-sm text-gray-400">Concluídas</div>
            </div>
            <div className="bg-blue-500/20 p-4 rounded-xl">
              <div className="text-2xl font-bold text-blue-400">{taskStats.pending}</div>
              <div className="text-sm text-gray-400">Pendentes</div>
            </div>
            <div className="bg-red-500/20 p-4 rounded-xl">
              <div className="text-2xl font-bold text-red-400">{taskStats.overdue}</div>
              <div className="text-sm text-gray-400">Atrasadas</div>
            </div>
          </div>
        </div>

        {/* Botões de filtro com melhor design e simetria */}
        <div className="flex justify-center gap-4 mb-12">
          <button 
            onClick={() => setShowCompleted(false)} 
            className={`group px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 font-semibold flex items-center space-x-3 ${
              !showCompleted 
                ? 'bg-gradient-to-r from-tealDark to-tealLight text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Tarefas Pendentes</span>
            <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
              {taskStats.pending}
            </span>
          </button>
          
          <button 
            onClick={() => setShowCompleted(true)} 
            className={`group px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 font-semibold flex items-center space-x-3 ${
              showCompleted 
                ? 'bg-gradient-to-r from-tealDark to-tealLight text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Tarefas Concluídas</span>
            <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
              {taskStats.completed}
            </span>
          </button>
        </div>

        {/* Modais */}
        {isAddingTask && (
          <Modal
            message="Criar Nova Tarefa"
            onConfirm={handleAddTask}
            onCancel={() => {
              setIsAddingTask(false);
              resetForm();
            }}
            modalContent={formContent}
          />
        )}

        {isEditing && taskToEdit && (
          <Modal
            message="Editar Tarefa"
            onConfirm={handleUpdateTask}
            onCancel={() => {
              setIsEditing(false);
              setTaskToEdit(null);
              resetForm();
            }}
            modalContent={formContent}
          />
        )}

        {/* Lista de tarefas com melhor layout */}
        {sortedTasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              {showCompleted ? "Nenhuma tarefa concluída" : "Nenhuma tarefa pendente"}
            </h3>
            <p className="text-gray-500 text-lg">
              {showCompleted 
                ? "Complete algumas tarefas para vê-las aqui!" 
                : "Clique em 'Nova Tarefa' para começar!"
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={() => openDeleteModal(task.id)}
                onComplete={() => handleCompleteTask(task.id)}
                onEdit={() => startEditingTask(task)}
              />
            ))}
          </div>
        )}

        {/* Modal de confirmação de exclusão */}
        {isModalOpen && (
          <Modal
            message="Confirmar Exclusão"
            onConfirm={confirmDelete}
            onCancel={closeDeleteModal}
            modalContent={
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <p className="text-gray-300 text-lg">
                  Tem certeza que deseja excluir a tarefa
                </p>
                <p className="text-lightYellow font-semibold text-xl mt-2">
                  "{taskToDelete.title}"?
                </p>
                <p className="text-red-400 text-sm mt-4">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
            }
          />
        )}
      </div>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}

export default Home;


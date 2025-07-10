import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "../components/Header";
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal";
import Footer from "../components/Footer";
import SearchAndFilters from "../components/SearchAndFilters";
import { useTaskStorage } from "../hooks/useLocalStorage";
import { useToast } from "../components/Toast";

function Home() {
  // Categorias predefinidas
  const categories = [
    { id: 'trabalho', name: 'Trabalho', color: 'bg-blue-500' },
    { id: 'pessoal', name: 'Pessoal', color: 'bg-green-500' },
    { id: 'estudos', name: 'Estudos', color: 'bg-purple-500' },
    { id: 'compras', name: 'Compras', color: 'bg-orange-500' },
    { id: 'saude', name: 'Saúde', color: 'bg-red-500' },
    { id: 'lazer', name: 'Lazer', color: 'bg-pink-500' },
    { id: 'financas', name: 'Finanças', color: 'bg-yellow-500' },
    { id: 'casa', name: 'Casa', color: 'bg-indigo-500' }
  ];

  // Tarefas padrão apenas para primeira execução
  const defaultTasks = [
    { 
      id: uuidv4(), 
      title: "Bem-vindo ao Task Flow!", 
      description: "Esta é uma tarefa de exemplo. Você pode editá-la ou excluí-la.", 
      completed: false, 
      dueDate: "2025-12-31", 
      completedDate: null,
      createdAt: new Date().toISOString(),
      category: 'pessoal'
    }
  ];

  // Hook personalizado para gerenciar tarefas com localStorage
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTaskStorage(defaultTasks);
  
  // Hook para notificações
  const { showToast, ToastContainer } = useToast();

  // Estados do formulário e UI
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "", category: "" });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState({ id: null, title: "" });
  const [showCompleted, setShowCompleted] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [dueDateError, setDueDateError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [pastDateError, setPastDateError] = useState(false);
  
  // Estados para pesquisa e filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Estado para controlar o tipo de ordenação
  const [sortType, setSortType] = useState('priority'); // 'priority' ou 'creation'

  // Função para calcular os dias restantes (corrigida)
  const calculateDaysRemaining = (dueDate) => {
    // Normalizar a data atual para o início do dia
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Normalizar a data de vencimento para o início do dia
    const due = new Date(dueDate + 'T00:00:00');
    const dueNormalized = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    
    // Calcular a diferença em dias
    const timeDiff = dueNormalized.getTime() - todayNormalized.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
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

  // Função para filtrar tarefas
  const filterTasks = (tasksToFilter) => {
    let filtered = tasksToFilter;

    // Filtrar por status (concluídas/pendentes)
    filtered = filtered.filter(task => showCompleted ? task.completed : !task.completed);

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }

    // Filtrar por termo de pesquisa
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search)
      );
    }

    return filtered;
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

    // Usar a mesma lógica de cálculo de dias para validação
    const daysRemaining = calculateDaysRemaining(newTask.dueDate);
    const isPastDate = daysRemaining < 0;
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
      category: newTask.category || 'pessoal', // Categoria padrão
      completed: false,
      completedDate: null,
      createdAt: new Date().toISOString()
    };

    addTask(novaTarefa);
    setNewTask({ title: "", description: "", dueDate: "", category: "" });
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
      category: newTask.category || taskToEdit.category,
      updatedAt: new Date().toISOString()
    };

    updateTask(taskToEdit.id, updatedTaskData);
    setIsEditing(false);
    setTaskToEdit(null);
    setNewTask({ title: "", description: "", dueDate: "", category: "" });
    
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
      category: task.category || ''
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setNewTask({ title: "", description: "", dueDate: "", category: "" });
    setTitleError(false);
    setDueDateError(false);
    setPastDateError(false);
  };

  // Filtrar e ordenar tarefas
  const filteredTasks = filterTasks(tasks);
  const sortedTasks = sortTasks(filteredTasks);

  // Calcular estatísticas das tarefas (corrigido)
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => {
      if (t.completed) return false;
      const daysRemaining = calculateDaysRemaining(t.dueDate);
      return daysRemaining < 0;
    }).length,
    dueToday: tasks.filter(t => {
      if (t.completed) return false;
      const daysRemaining = calculateDaysRemaining(t.dueDate);
      return daysRemaining === 0;
    }).length,
    dueSoon: tasks.filter(t => {
      if (t.completed) return false;
      const daysRemaining = calculateDaysRemaining(t.dueDate);
      return daysRemaining > 0 && daysRemaining <= 3;
    }).length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0,
    byCategory: categories.reduce((acc, cat) => {
      acc[cat.id] = tasks.filter(t => t.category === cat.id).length;
      return acc;
    }, {})
  };

  const formContent = (
    <div className="space-y-6">
      {/* Campo de título */}
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

      {/* Campo de categoria */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-lightYellow">
          Categoria
        </label>
        <select
          name="category"
          value={newTask.category}
          onChange={handleFormChange}
          className="w-full p-4 bg-gray-800 text-white rounded-xl border-2 border-gray-600 focus:border-tealLight focus:outline-none text-lg transition-all duration-300"
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Campo de descrição */}
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

      {/* Campo de data */}
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
      
      {/* Container principal */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Cabeçalho da seção */}
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
        </div>

        {/* Componente de pesquisa e filtros */}
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          taskStats={taskStats}
          showCompleted={showCompleted}
          onToggleCompleted={setShowCompleted}
        />

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

        {/* Lista de tarefas */}
        {sortedTasks.length === 0 ? (
          <div className="text-center py-20 mt-12">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              {searchTerm ? "Nenhuma tarefa encontrada" : 
               showCompleted ? "Nenhuma tarefa concluída" : "Nenhuma tarefa pendente"}
            </h3>
            <p className="text-gray-500 text-lg">
              {searchTerm ? `Tente pesquisar por "${searchTerm}" com outros filtros` :
               showCompleted ? "Complete algumas tarefas para vê-las aqui!" : 
               "Clique em 'Nova Tarefa' para começar!"}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="mt-4 px-6 py-2 bg-tealDark hover:bg-tealLight text-white rounded-xl transition-all duration-300"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mt-12">
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                categories={categories}
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


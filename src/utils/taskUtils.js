/**
 * Utilitários para gerenciamento de tarefas
 */

/**
 * Calcula os dias restantes até o vencimento de uma tarefa
 * @param {string} dueDate - Data de vencimento no formato YYYY-MM-DD
 * @returns {number} - Número de dias restantes (negativo se atrasada)
 */
export const calculateDaysRemaining = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const timeDiff = due - today;
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24) + 1);
  return daysRemaining;
};

/**
 * Determina o status de uma tarefa baseado na data de vencimento
 * @param {Object} task - Objeto da tarefa
 * @returns {Object} - Objeto com status, cor e ícone
 */
export const getTaskStatus = (task) => {
  if (task.completed) {
    return {
      status: 'completed',
      label: 'Concluída',
      color: 'text-tealLight',
      bgColor: 'bg-tealLight/10',
      priority: 0
    };
  }

  const daysRemaining = calculateDaysRemaining(task.dueDate);

  if (daysRemaining < 0) {
    return {
      status: 'overdue',
      label: 'Atrasada',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      priority: 4
    };
  }

  if (daysRemaining === 0) {
    return {
      status: 'due-today',
      label: 'Vence hoje',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      priority: 3
    };
  }

  if (daysRemaining <= 3) {
    return {
      status: 'due-soon',
      label: `${daysRemaining} dias restantes`,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      priority: 2
    };
  }

  return {
    status: 'normal',
    label: `${daysRemaining} dias restantes`,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    priority: 1
  };
};

/**
 * Ordena tarefas por prioridade (status) e data de vencimento
 * @param {Array} tasks - Array de tarefas
 * @returns {Array} - Array de tarefas ordenadas
 */
export const sortTasksByPriority = (tasks) => {
  return [...tasks].sort((a, b) => {
    const statusA = getTaskStatus(a);
    const statusB = getTaskStatus(b);

    // Primeiro ordena por prioridade do status
    if (statusA.priority !== statusB.priority) {
      return statusB.priority - statusA.priority;
    }

    // Se a prioridade for igual, ordena por data de vencimento
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return dateA - dateB;
  });
};

/**
 * Filtra tarefas por texto de pesquisa
 * @param {Array} tasks - Array de tarefas
 * @param {string} searchText - Texto de pesquisa
 * @returns {Array} - Array de tarefas filtradas
 */
export const filterTasksBySearch = (tasks, searchText) => {
  if (!searchText.trim()) return tasks;

  const search = searchText.toLowerCase();
  return tasks.filter(task => 
    task.title.toLowerCase().includes(search) ||
    task.description.toLowerCase().includes(search)
  );
};

/**
 * Calcula estatísticas das tarefas
 * @param {Array} tasks - Array de tarefas
 * @returns {Object} - Objeto com estatísticas
 */
export const calculateTaskStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;
  const overdue = tasks.filter(t => {
    if (t.completed) return false;
    return calculateDaysRemaining(t.dueDate) < 0;
  }).length;
  const dueToday = tasks.filter(t => {
    if (t.completed) return false;
    return calculateDaysRemaining(t.dueDate) === 0;
  }).length;
  const dueSoon = tasks.filter(t => {
    if (t.completed) return false;
    const days = calculateDaysRemaining(t.dueDate);
    return days > 0 && days <= 3;
  }).length;

  return {
    total,
    completed,
    pending,
    overdue,
    dueToday,
    dueSoon,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  };
};

/**
 * Exporta tarefas para formato JSON
 * @param {Array} tasks - Array de tarefas
 * @returns {string} - String JSON das tarefas
 */
export const exportTasksToJSON = (tasks) => {
  const exportData = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    tasks: tasks
  };
  return JSON.stringify(exportData, null, 2);
};

/**
 * Importa tarefas de formato JSON
 * @param {string} jsonString - String JSON das tarefas
 * @returns {Array} - Array de tarefas importadas
 */
export const importTasksFromJSON = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.tasks && Array.isArray(data.tasks)) {
      return data.tasks;
    }
    throw new Error('Formato de arquivo inválido');
  } catch (error) {
    throw new Error('Erro ao importar tarefas: ' + error.message);
  }
};

/**
 * Valida se uma data está no formato correto
 * @param {string} dateString - String da data
 * @returns {boolean} - True se válida
 */
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Formata data para exibição
 * @param {string} dateString - String da data
 * @param {string} locale - Locale para formatação (padrão: pt-BR)
 * @returns {string} - Data formatada
 */
export const formatDate = (dateString, locale = 'pt-BR') => {
  if (!isValidDate(dateString)) return 'Data inválida';
  
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};


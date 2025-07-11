import { useState, useEffect } from 'react';

// Hook personalizado para gerenciar tarefas no localStorage
export const useTaskStorage = (defaultTasks = []) => {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('taskflow-tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        return parsedTasks.length > 0 ? parsedTasks : defaultTasks;
      }
      return defaultTasks;
    } catch (error) {
      console.error('Erro ao carregar tarefas do localStorage:', error);
      return defaultTasks;
    }
  });

  // Salvar tarefas no localStorage sempre que houver mudanças
  useEffect(() => {
    try {
      localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas no localStorage:', error);
    }
  }, [tasks]);

  // Função para adicionar uma nova tarefa
  const addTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  // Função para atualizar uma tarefa existente
  const updateTask = (taskId, updatedData) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updatedData } : task
      )
    );
  };

  // Função para excluir uma tarefa
  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  // Função para alternar o status de conclusão de uma tarefa
  const toggleTaskCompletion = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const isCompleting = !task.completed;
          return {
            ...task,
            completed: isCompleting,
            completedDate: isCompleting ? new Date().toISOString() : null
          };
        }
        return task;
      })
    );
  };

  // Função para limpar todas as tarefas
  const clearAllTasks = () => {
    setTasks([]);
  };

  // Função para importar tarefas (substituir todas)
  const importTasks = (newTasks) => {
    setTasks(newTasks);
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    clearAllTasks,
    importTasks
  };
};


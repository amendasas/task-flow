import { useState } from 'react';

/**
 * Hook personalizado para gerenciar dados no localStorage
 * @param {string} key - Chave para armazenar no localStorage
 * @param {any} initialValue - Valor inicial se não houver dados no localStorage
 * @returns {[any, function]} - [valor, função para atualizar]
 */
export function useLocalStorage(key, initialValue) {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Tenta obter o item do localStorage
      const item = window.localStorage.getItem(key);
      // Retorna o valor parseado ou o valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Se houver erro, retorna o valor inicial
      console.error(`Erro ao ler localStorage para a chave "${key}":`, error);
      return initialValue;
    }
  });

  // Função para atualizar o valor
  const setValue = (value) => {
    try {
      // Permite que value seja uma função como no useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Salva no estado
      setStoredValue(valueToStore);
      
      // Salva no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Se houver erro, apenas loga
      console.error(`Erro ao salvar no localStorage para a chave "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook para gerenciar especificamente as tarefas no localStorage
 * @param {Array} defaultTasks - Tarefas padrão se não houver dados salvos
 * @returns {[Array, function]} - [tarefas, função para atualizar tarefas]
 */
export function useTaskStorage(defaultTasks = []) {
  const [tasks, setTasks] = useLocalStorage('taskflow-tasks', defaultTasks);

  // Função para adicionar uma tarefa
  const addTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  // Função para atualizar uma tarefa
  const updateTask = (taskId, updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
  };

  // Função para deletar uma tarefa
  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  // Função para marcar/desmarcar como concluída
  const toggleTaskCompletion = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              completed: !task.completed,
              completedDate: !task.completed 
                ? new Date().toISOString().split("T")[0] 
                : null
            } 
          : task
      )
    );
  };

  return {
    tasks,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
  };
}


import { useState, useEffect } from 'react';

export const useTheme = () => {
  // Estado do tema (dark ou light)
  const [theme, setTheme] = useState(() => {
    // Verificar se há um tema salvo no localStorage
    const savedTheme = localStorage.getItem('taskflow-theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Se não há tema salvo, verificar preferência do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    
    // Padrão: tema escuro
    return 'dark';
  });

  // Aplicar o tema ao documento
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    
    // Salvar no localStorage
    localStorage.setItem('taskflow-theme', theme);
  }, [theme]);

  // Escutar mudanças na preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    
    const handleChange = (e) => {
      // Só atualizar se não há preferência salva pelo usuário
      const savedTheme = localStorage.getItem('taskflow-theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'light' : 'dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Função para alternar o tema
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Função para definir um tema específico
  const setSpecificTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setTheme(newTheme);
    }
  };

  // Verificar se é tema escuro
  const isDark = theme === 'dark';

  // Verificar se é tema claro
  const isLight = theme === 'light';

  return {
    theme,
    isDark,
    isLight,
    toggleTheme,
    setTheme: setSpecificTheme
  };
};


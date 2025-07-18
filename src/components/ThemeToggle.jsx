import { useTheme } from "../hooks/useTheme.js";

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="group relative p-3 bg-theme-secondary hover:bg-theme-tertiary rounded-xl border border-theme transition-all duration-300 transform hover:scale-105 interactive-element"
      title={`Alternar para tema ${isDark ? 'claro' : 'escuro'}`}
      aria-label={`Alternar para tema ${isDark ? 'claro' : 'escuro'}`}
    >
      <div className="relative w-6 h-6">
        {/* Ícone do Sol (tema claro) */}
        <svg
          className={`absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-300 transform ${
            isDark 
              ? 'opacity-0 rotate-90 scale-0' 
              : 'opacity-100 rotate-0 scale-100'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>

        {/* Ícone da Lua (tema escuro) */}
        <svg
          className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300 transform ${
            isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>

      {/* Indicador de tema ativo */}
      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-all duration-300 ${
        isDark 
          ? 'bg-blue-400 shadow-lg shadow-blue-400/50' 
          : 'bg-yellow-500 shadow-lg shadow-yellow-500/50'
      }`}></div>
    </button>
  );
}

export default ThemeToggle;
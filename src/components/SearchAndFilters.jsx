import { useState } from "react";

function SearchAndFilters({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange, 
  categories,
  taskStats,
  showCompleted,
  onToggleCompleted 
}) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Barra de pesquisa */}
      <div className="relative max-w-md mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Pesquisar tarefas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-input w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-theme-muted hover:text-theme-primary transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Botão para abrir/fechar filtros */}
      <div className="text-center">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="inline-flex items-center space-x-2 bg-theme-secondary hover:bg-theme-tertiary px-4 py-2 rounded-xl transition-all duration-300 border border-theme"
        >
          <svg className="w-4 h-4 text-tealLight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          <span className="text-theme-secondary text-sm">
            {isFiltersOpen ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </span>
          <svg className={`w-4 h-4 text-theme-muted transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Painel de filtros */}
      {isFiltersOpen && (
        <div className="bg-theme-tertiary rounded-xl p-6 space-y-6 animate-fadeIn border border-theme">
          
          {/* Filtro por categoria */}
          <div>
            <h4 className="text-sm font-semibold text-accent mb-3">Filtrar por Categoria</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              <button
                onClick={() => onCategoryChange('')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedCategory === '' 
                    ? 'bg-tealLight text-white shadow-lg' 
                    : 'bg-theme-secondary text-theme-secondary hover:bg-theme-tertiary border border-theme'
                }`}
              >
                Todas ({taskStats.total})
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                    selectedCategory === category.id 
                      ? 'bg-tealLight text-white shadow-lg' 
                      : 'bg-theme-secondary text-theme-secondary hover:bg-theme-tertiary border border-theme'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${category.color}`}></span>
                  <span>{category.name}</span>
                  <span className="text-xs opacity-75">
                    ({taskStats.byCategory[category.id] || 0})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por status */}
          <div>
            <h4 className="text-sm font-semibold text-accent mb-3">Filtrar por Status</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onToggleCompleted(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  !showCompleted 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-theme-secondary text-theme-secondary hover:bg-theme-tertiary border border-theme'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Pendentes ({taskStats.pending})</span>
              </button>
              
              <button
                onClick={() => onToggleCompleted(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  showCompleted 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : 'bg-theme-secondary text-theme-secondary hover:bg-theme-tertiary border border-theme'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Concluídas ({taskStats.completed})</span>
              </button>
            </div>
          </div>

          {/* Estatísticas rápidas */}
          <div>
            <h4 className="text-sm font-semibold text-accent mb-3">Estatísticas Rápidas</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="status-overdue p-3 rounded-lg text-center">
                <div className="text-lg font-bold">{taskStats.overdue}</div>
                <div className="text-xs text-theme-muted">Atrasadas</div>
              </div>
              <div className="status-due-today p-3 rounded-lg text-center">
                <div className="text-lg font-bold">{taskStats.dueToday}</div>
                <div className="text-xs text-theme-muted">Vence Hoje</div>
              </div>
              <div className="status-due-soon p-3 rounded-lg text-center">
                <div className="text-lg font-bold">{taskStats.dueSoon}</div>
                <div className="text-xs text-theme-muted">Vence em Breve</div>
              </div>
              <div className="status-completed p-3 rounded-lg text-center">
                <div className="text-lg font-bold">{taskStats.completionRate}%</div>
                <div className="text-xs text-theme-muted">Taxa de Conclusão</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchAndFilters;


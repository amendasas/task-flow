import ThemeToggle from "./ThemeToggle";

function Header({ setIsAddingTask }) {
  return (
    <header className="bg-theme-secondary border-b border-theme shadow-theme-lg">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex justify-between items-center">
          
          {/* Logo e título */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-tealLight to-tealDark rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-lightYellow to-tealLight bg-clip-text text-transparent">
                Task Flow
              </h1>
              <p className="text-theme-muted text-sm">
                Organize suas tarefas com eficiência
              </p>
            </div>
          </div>

          {/* Controles do header */}
          <div className="flex items-center space-x-4">
            
            {/* Toggle de tema */}
            <ThemeToggle />

            {/* Botão de nova tarefa */}
            <button
              onClick={() => setIsAddingTask(true)}
              className="group flex items-center space-x-3 bg-gradient-to-r from-tealDark to-tealLight hover:from-tealLight hover:to-tealDark text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl interactive-element"
            >
              <svg className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">Nova Tarefa</span>
            </button>
          </div>
        </div>

        {/* Barra de progresso decorativa */}
        <div className="mt-6 w-full h-1 bg-theme-tertiary rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-tealLight to-lightYellow rounded-full animate-pulse"></div>
        </div>
      </div>
    </header>
  );
}

export default Header;


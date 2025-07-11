import { useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from "./ThemeToggle";

function Header({ setIsAddingTask }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isDashboard = location.pathname === '/dashboard';

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
              <h1 className="text-3xl font-bold title-gradient">
                Task Flow
              </h1>
              <p className="text-theme-muted text-sm">
                Organize suas tarefas com eficiência
              </p>
            </div>
          </div>

          {/* Controles do header */}
          <div className="flex items-center space-x-4">
            
            {/* Navegação */}
            <div className="flex items-center space-x-2 bg-theme-tertiary rounded-xl p-1 border border-theme">
              <button
                onClick={() => navigate('/')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  !isDashboard
                    ? 'bg-tealLight text-white shadow-lg'
                    : 'text-theme-secondary hover:bg-theme-secondary'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className="hidden sm:inline">Tarefas</span>
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isDashboard
                    ? 'bg-tealLight text-white shadow-lg'
                    : 'text-theme-secondary hover:bg-theme-secondary'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="hidden sm:inline">Dashboard</span>
              </button>
            </div>
            
            {/* Toggle de tema */}
            <ThemeToggle />

            {/* Botão de nova tarefa - só aparece na página de tarefas */}
            {!isDashboard && setIsAddingTask && (
              <button
                onClick={() => setIsAddingTask(true)}
                className="group flex items-center space-x-3 bg-gradient-to-r from-tealDark to-tealLight hover:from-tealLight hover:to-tealDark text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl interactive-element"
              >
                <svg className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="hidden sm:inline">Nova Tarefa</span>
              </button>
            )}
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


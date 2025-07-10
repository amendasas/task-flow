function Header({ setIsAddingTask }) {
  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 shadow-2xl border-b border-tealLight/20">
      <div className="container mx-auto flex justify-between items-center max-w-7xl">
        {/* Logo e título com melhor tipografia */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-tealLight to-tealDark rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-lightYellow to-tealLight bg-clip-text text-transparent">
            Task Flow
          </h1>
        </div>

        {/* Botão melhorado com ícone e melhor design */}
        <button
          className="group bg-gradient-to-r from-tealDark to-tealLight text-white px-6 py-3 rounded-xl hover:from-tealLight hover:to-tealDark transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2 font-semibold"
          onClick={() => setIsAddingTask(true)}
        >
          <svg className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Nova Tarefa</span>
        </button>
      </div>
    </header>
  );
}

export default Header;

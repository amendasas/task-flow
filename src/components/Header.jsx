function Header({ setIsAddingTask }) {
  return (
    <header className="bg-dark p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-lightYellow">Task Flow</h1>
        <button
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-tealDark transition"
          onClick={() => setIsAddingTask(true)} // Chama a função para abrir o modal
        >
          Nova Tarefa
        </button>
      </div>
    </header>
  );
}

export default Header;

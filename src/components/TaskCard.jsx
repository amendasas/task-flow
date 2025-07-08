function TaskCard({ task, onDelete, onComplete, onEdit }) {
  // Função para calcular os dias restantes
  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - today;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  const daysRemaining = calculateDaysRemaining(task.dueDate);

  return (
    <div
      className={`bg-dark p-4 rounded-lg shadow-md transition hover:shadow-lg hover:scale-105 duration-200 border ${
        task.completed ? "border-tealLight" : "border-tealDark"
      }`}
    >
      {/* Título da tarefa com estilo riscado se concluída */}
      <h2
        className={`text-xl font-semibold break-words ${
          task.completed ? "line-through text-gray-500" : "text-lightYellow"
        }`}
      >
        {task.title}
      </h2>

      {/* Descrição da tarefa com estilo riscado se concluída */}
      <p
        className={`mt-2 break-words ${
          task.completed ? "line-through text-gray-500" : "text-tealLight"
        }`}
      >
        {task.description}
      </p>

      {/* Data de conclusão e dias restantes */}
      <div className="mt-2 text-sm text-gray-400">
      <p>Data de Conclusão: {new Date(task.dueDate + 'T00:00:00').toLocaleDateString()}</p>
        {task.completed ? (
          <p>Concluída em: {new Date(task.completedDate + 'T00:00:00').toLocaleDateString()}</p>
        ) : (
          <p>
            Dias Restantes:{" "}
            <span className={daysRemaining < 0 ? "text-red-500" : "text-green-500"}>
              {daysRemaining < 0 ? "Tarefa Atrasada" : `${daysRemaining} dias`}
            </span>
          </p>
        )}
      </div>

      {/* Botões de ação */}
      <div className="mt-4 flex justify-between">
        <button
          className="bg-tealDark text-white px-3 py-1 rounded-lg hover:bg-tealLight transition"
          onClick={onComplete}
        >
          {task.completed ? "Desmarcar" : "Concluir"}
        </button>
        <button
          className="bg-primary text-white px-3 py-1 rounded-lg hover:bg-red-600/50 transition"
          onClick={onDelete}
        >
          Excluir
        </button>
        <button
          onClick={() => onEdit(task)}
          className="bg-lightYellow text-gray-900 px-3 py-1 rounded-lg hover:bg-yellow-200 transition"
        >
          Editar
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
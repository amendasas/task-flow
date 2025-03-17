function TaskCard({ task, onDelete, onComplete }) {
  return (
    <div
      className={`bg-dark p-4 rounded-lg shadow-md transition hover:shadow-lg hover:scale-105 duration-200 border ${
        task.completed ? "border-tealLight" : "border-tealDark"
      }`}
    >
      <h2 className="text-xl font-semibold text-lightYellow break-words">{task.title}</h2> {/* Adicionando break-words */}
      <p className="text-tealLight mt-2 break-words">{task.description}</p>
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
      </div>
    </div>
  );
}

export default TaskCard;

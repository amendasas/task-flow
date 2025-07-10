function TaskCard({ task, onDelete, onComplete, onEdit }) {
  // Função para calcular os dias restantes
  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - today;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24) + 1);
    return daysRemaining;
  };

  const daysRemaining = calculateDaysRemaining(task.dueDate);

  // Função para determinar a cor do status baseado nos dias restantes
  const getStatusColor = () => {
    if (task.completed) return "text-tealLight";
    if (daysRemaining < 0) return "text-red-400";
    if (daysRemaining <= 3) return "text-yellow-400";
    return "text-green-400";
  };

  const getStatusIcon = () => {
    if (task.completed) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (daysRemaining < 0) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className={`group relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border ${
      task.completed ? "border-tealLight/30" : "border-gray-700"
    } hover:border-tealLight/50`}>
      
      {/* Indicador de status no canto superior direito */}
      <div className={`absolute top-4 right-4 flex items-center space-x-1 ${getStatusColor()}`}>
        {getStatusIcon()}
      </div>

      {/* Título da tarefa com melhor tipografia */}
      <div className="pr-8 mb-4">
        <h2 className={`text-xl font-bold break-words leading-tight ${
          task.completed ? "line-through text-gray-500" : "text-lightYellow"
        }`}>
          {task.title}
        </h2>
      </div>

      {/* Descrição da tarefa */}
      {task.description && (
        <p className={`mb-4 break-words text-sm leading-relaxed ${
          task.completed ? "line-through text-gray-500" : "text-gray-300"
        }`}>
          {task.description}
        </p>
      )}

      {/* Informações de data com melhor layout */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-400">Vencimento:</span>
          <span className="text-white font-medium">
            {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}
          </span>
        </div>

        {task.completed ? (
          <div className="flex items-center space-x-2 text-sm">
            <svg className="w-4 h-4 text-tealLight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-400">Concluída em:</span>
            <span className="text-tealLight font-medium">
              {new Date(task.completedDate + 'T00:00:00').toLocaleDateString('pt-BR')}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-sm">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-400">Status:</span>
            <span className={`font-medium ${getStatusColor()}`}>
              {daysRemaining < 0 ? "Atrasada" : daysRemaining === 0 ? "Vence hoje" : `${daysRemaining} dias restantes`}
            </span>
          </div>
        )}
      </div>

      {/* Botões de ação com melhor design e simetria */}
      <div className="flex gap-2 justify-between">
        <button
          className="group flex-1 bg-gradient-to-r from-tealDark to-tealLight text-white py-2.5 px-4 rounded-lg hover:from-tealLight hover:to-tealDark transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center space-x-2"
          onClick={onComplete}
        >
          <svg className="w-4 h-4 transition-transform group-hover:scale-110 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {task.completed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            )}
          </svg>
          <span className="text-sm">{task.completed ? "Reabrir" : "Concluir"}</span>
        </button>

        <button
          onClick={() => onEdit(task)}
          className="group flex-1 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-2.5 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4 transition-transform group-hover:scale-110 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-sm">Editar</span>
        </button>

        <button
          className="group flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-2.5 px-4 rounded-lg hover:from-red-500 hover:to-red-400 transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center space-x-2"
          onClick={onDelete}
        >
          <svg className="w-4 h-4 transition-transform group-hover:scale-110 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="text-sm">Excluir</span>
        </button>
      </div>
    </div>
  );
}

export default TaskCard;


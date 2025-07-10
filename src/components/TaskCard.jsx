function TaskCard({ task, onDelete, onComplete, onEdit, categories }) {
  // Função para calcular os dias restantes
  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - today;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  // Função para obter o status da tarefa
  const getTaskStatus = () => {
    if (task.completed) {
      return {
        text: "Concluída",
        className: "status-completed",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    }

    const daysRemaining = calculateDaysRemaining(task.dueDate);

    if (daysRemaining < 0) {
      return {
        text: `${Math.abs(daysRemaining)} dias atrasada`,
        className: "status-overdue",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    }

    if (daysRemaining === 0) {
      return {
        text: "Vence hoje",
        className: "status-due-today",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    }

    if (daysRemaining <= 3) {
      return {
        text: `${daysRemaining} dias restantes`,
        className: "status-due-soon",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    }

    return {
      text: `${daysRemaining} dias restantes`,
      className: "status-normal",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
  };

  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Encontrar a categoria da tarefa
  const taskCategory = categories.find(cat => cat.id === task.category);

  const status = getTaskStatus();

  return (
    <div className={`group relative task-card p-8 rounded-2xl shadow-theme transition-all duration-300 hover:shadow-theme-lg hover:scale-[1.02] min-h-[320px] ${
      task.completed ? "task-card-completed border-tealLight/30" : ""
    } hover:border-tealLight/50 interactive-element`}>
      
      {/* Header com categoria e status */}
      <div className="flex justify-between items-start mb-4">
        {/* Categoria */}
        {taskCategory && (
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${taskCategory.color}`}></span>
            <span className="text-xs font-medium task-card-meta uppercase tracking-wide">
              {taskCategory.name}
            </span>
          </div>
        )}
        
        {/* Status */}
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${status.className}`}>
          <span>{status.icon}</span>
          <span className="text-xs font-medium">
            {status.text}
          </span>
        </div>
      </div>

      {/* Título */}
      <h3 className={`text-2xl font-bold mb-3 leading-tight ${
        task.completed ? "task-card-title-completed line-through" : "task-card-title"
      }`}>
        {task.title}
      </h3>

      {/* Descrição */}
      {task.description && (
        <p className={`mb-6 leading-relaxed ${
          task.completed ? "task-card-description-completed" : "task-card-description"
        }`}>
          {task.description}
        </p>
      )}

      {/* Informações de data */}
      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 category-icon rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-tealLight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs task-card-meta uppercase tracking-wide">Vencimento</p>
              <p className="text-sm font-semibold task-card-title">{formatDate(task.dueDate)}</p>
            </div>
          </div>

          {task.createdAt && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 category-icon rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 task-card-meta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="text-xs task-card-meta uppercase tracking-wide">Criada em</p>
                <p className="text-sm font-semibold task-card-description">
                  {formatDate(new Date(task.createdAt).toISOString().split('T')[0])}
                </p>
              </div>
            </div>
          )}
        </div>

        {task.completed && task.completedDate && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-tealLight/20 border border-tealLight/30 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-tealLight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs task-card-meta uppercase tracking-wide">Concluída em</p>
              <p className="text-sm font-semibold text-tealLight">
                {formatDate(new Date(task.completedDate).toISOString().split('T')[0])}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botões de ação */}
      <div className="flex justify-between items-center pt-4 border-t task-card-divider">
        <div className="flex space-x-2">
          {/* Botão de completar/reabrir */}
          <button
            onClick={onComplete}
            className={`group/btn flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              task.completed ? "btn-reopen" : "btn-complete"
            }`}
            title={task.completed ? "Reabrir tarefa" : "Marcar como concluída"}
          >
            {task.completed ? (
              <>
                <svg className="w-4 h-4 transition-transform group-hover/btn:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm">Reabrir</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">Concluir</span>
              </>
            )}
          </button>

          {/* Botão de editar */}
          <button
            onClick={onEdit}
            className="group/btn flex items-center space-x-2 px-4 py-2 btn-edit rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
            title="Editar tarefa"
          >
            <svg className="w-4 h-4 transition-transform group-hover/btn:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-sm">Editar</span>
          </button>
        </div>

        {/* Botão de excluir */}
        <button
          onClick={onDelete}
          className="group/btn flex items-center space-x-2 px-4 py-2 btn-delete rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          title="Excluir tarefa"
        >
          <svg className="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="text-sm">Excluir</span>
        </button>
      </div>
    </div>
  );
}

export default TaskCard;


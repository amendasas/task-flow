import { useState } from "react";
import { useTaskStorage } from "../hooks/useLocalStorage";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Dashboard() {
  // Hook para acessar as tarefas
  const { tasks } = useTaskStorage([]);
  
  // Estado para controlar período de análise
  const [period, setPeriod] = useState('week'); // 'week', 'month', 'year'

  // Função para calcular os dias restantes
  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const due = new Date(dueDate + 'T00:00:00');
    const dueNormalized = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const timeDiff = dueNormalized.getTime() - todayNormalized.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  // Função para filtrar tarefas por período (baseado na data de conclusão para tarefas concluídas)
  const getTasksInPeriod = (tasks, period) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    return tasks.filter(task => {
      // Para tarefas concluídas, usar a data de conclusão
      if (task.completed && task.completedDate) {
        const completedDate = new Date(task.completedDate);
        return completedDate >= startDate;
      }
      // Para tarefas não concluídas, usar a data de criação
      const taskDate = new Date(task.createdAt || task.id);
      return taskDate >= startDate;
    });
  };

  // Calcular estatísticas
  const periodTasks = getTasksInPeriod(tasks, period);
  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);
  const overdueTasks = tasks.filter(t => {
    if (t.completed) return false;
    return calculateDaysRemaining(t.dueDate) < 0;
  });

  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const productivityScore = Math.max(0, Math.min(100, completionRate - (overdueTasks.length * 5)));

  // Estatísticas por categoria
  const categories = [
    { id: 'trabalho', name: 'Trabalho', color: 'bg-blue-500' },
    { id: 'pessoal', name: 'Pessoal', color: 'bg-green-500' },
    { id: 'estudos', name: 'Estudos', color: 'bg-purple-500' },
    { id: 'compras', name: 'Compras', color: 'bg-orange-500' },
    { id: 'saude', name: 'Saúde', color: 'bg-red-500' },
    { id: 'lazer', name: 'Lazer', color: 'bg-pink-500' },
    { id: 'financas', name: 'Finanças', color: 'bg-yellow-500' },
    { id: 'casa', name: 'Casa', color: 'bg-indigo-500' }
  ];

  const categoryStats = categories.map(cat => {
    const categoryTasks = tasks.filter(t => t.category === cat.id);
    const categoryCompleted = categoryTasks.filter(t => t.completed);
    return {
      ...cat,
      total: categoryTasks.length,
      completed: categoryCompleted.length,
      rate: categoryTasks.length > 0 ? Math.round((categoryCompleted.length / categoryTasks.length) * 100) : 0
    };
  }).filter(cat => cat.total > 0);

  // Função para calcular progresso dinâmico baseado no período
  const getDynamicProgress = () => {
  const today = new Date();
  let progress = [];
  let title = '';

  switch (period) {
    case 'week': {
      title = 'Progresso Semanal';
      const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayName = weekDays[date.getDay()];
        
        const completedOnDay = tasks.filter(task => {
          if (!task.completed || !task.completedDate) return false;
          const completedDate = new Date(task.completedDate);
          return completedDate.toDateString() === date.toDateString();
        }).length;

        progress.push({
          label: dayName,
          completed: completedOnDay,
          date: date.toISOString().split('T')[0],
          fullDate: date.toLocaleDateString('pt-BR')
        });
      }
      break;
    }

    case 'month': {
      title = 'Progresso Mensal';
      
      // Obter primeiro e último dia do mês atual
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
      
      // Encontrar o primeiro domingo do mês (ou antes se necessário)
      const firstSunday = new Date(firstDayOfMonth);
      firstSunday.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());
      
      // Calcular semanas do mês
      let weekStart = new Date(firstSunday);
      let weekNumber = 1;
      
      while (weekStart <= lastDayOfMonth) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        // Verificar se a semana tem pelo menos um dia no mês atual
        const weekHasDaysInMonth = (weekStart <= lastDayOfMonth && weekEnd >= firstDayOfMonth);
        
        if (weekHasDaysInMonth) {
          // Ajustar as datas para ficarem dentro do mês
          const effectiveStart = weekStart < firstDayOfMonth ? firstDayOfMonth : weekStart;
          const effectiveEnd = weekEnd > lastDayOfMonth ? lastDayOfMonth : weekEnd;
          
          const completedInWeek = tasks.filter(task => {
            if (!task.completed || !task.completedDate) return false;
            const completedDate = new Date(task.completedDate);
            return completedDate >= effectiveStart && completedDate <= effectiveEnd;
          }).length;

          progress.push({
            label: `Sem ${weekNumber}`,
            completed: completedInWeek,
            date: effectiveStart.toISOString().split('T')[0],
            fullDate: `${effectiveStart.toLocaleDateString('pt-BR')} - ${effectiveEnd.toLocaleDateString('pt-BR')}`
          });
          
          weekNumber++;
        }
        
        // Próxima semana
        weekStart.setDate(weekStart.getDate() + 7);
      }
      break;
    }

    case 'year': {
      title = 'Progresso Anual (Últimos 12 Meses)';
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const completedInMonth = tasks.filter(task => {
          if (!task.completed || !task.completedDate) return false;
          const completedDate = new Date(task.completedDate);
          return completedDate >= monthStart && completedDate <= monthEnd;
        }).length;

        progress.push({
          label: months[date.getMonth()],
          completed: completedInMonth,
          date: monthStart.toISOString().split('T')[0],
          fullDate: `${months[date.getMonth()]} ${date.getFullYear()}`
        });
      }
      break;
    }

    default: {
      return getDynamicProgress(); // Fallback para semana
    }
  }

  return { progress, title };
};

  const { progress: dynamicProgress, title: progressTitle } = getDynamicProgress();
  const maxCompleted = Math.max(...dynamicProgress.map(d => d.completed), 1);

  return (
    <div className="min-h-screen bg-theme-primary flex flex-col">
      <Header />
      
      {/* Container principal */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Cabeçalho da seção */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold section-title-gradient mb-4">
            Dashboard de Produtividade
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-tealLight to-tealDark rounded-full mx-auto mb-6"></div>
          <p className="text-theme-secondary text-lg max-w-2xl mx-auto">
            Acompanhe seu progresso e analise suas métricas de produtividade
          </p>
        </div>

        {/* Seletor de período */}
        <div className="flex justify-center mb-8">
          <div className="bg-theme-secondary rounded-xl p-2 border border-theme">
            {[
              { key: 'week', label: 'Última Semana' },
              { key: 'month', label: 'Último Mês' },
              { key: 'year', label: 'Último Ano' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  period === key
                    ? 'bg-tealLight text-white shadow-lg'
                    : 'text-theme-secondary hover:bg-theme-tertiary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards de estatísticas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          
          {/* Total de Tarefas */}
          <div className="task-card p-6 rounded-xl shadow-theme interactive-element">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-theme-primary">{tasks.length}</span>
            </div>
            <h3 className="text-theme-secondary font-semibold mb-1">Total de Tarefas</h3>
            <p className="text-theme-muted text-sm">Todas as tarefas criadas</p>
          </div>

          {/* Tarefas Pendentes */}
          <div className="task-card p-6 rounded-xl shadow-theme interactive-element">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-theme-primary">{pendingTasks.length}</span>
            </div>
            <h3 className="text-theme-secondary font-semibold mb-1">Pendentes</h3>
            <p className="text-theme-muted text-sm">Tarefas em andamento</p>
          </div>

          {/* Tarefas Concluídas */}
          <div className="task-card p-6 rounded-xl shadow-theme interactive-element">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-theme-primary">{completedTasks.length}</span>
            </div>
            <h3 className="text-theme-secondary font-semibold mb-1">Concluídas</h3>
            <p className="text-theme-muted text-sm">Tarefas finalizadas</p>
          </div>

          {/* Taxa de Conclusão */}
          <div className="task-card p-6 rounded-xl shadow-theme interactive-element">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-tealLight/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-tealLight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-theme-primary">{completionRate}%</span>
            </div>
            <h3 className="text-theme-secondary font-semibold mb-1">Taxa de Conclusão</h3>
            <p className="text-theme-muted text-sm">Percentual de sucesso</p>
          </div>

          {/* Score de Produtividade */}
          <div className="task-card p-6 rounded-xl shadow-theme interactive-element">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-theme-primary">{productivityScore}</span>
            </div>
            <h3 className="text-theme-secondary font-semibold mb-1">Score de Produtividade</h3>
            <p className="text-theme-muted text-sm">Baseado na performance</p>
          </div>
        </div>

        {/* Gráficos e análises */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Progresso Dinâmico */}
          <div className="task-card p-6 rounded-xl shadow-theme">
            <h3 className="text-xl font-bold text-theme-primary mb-6">{progressTitle}</h3>
            {dynamicProgress.every(item => item.completed === 0) ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-theme-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-theme-muted">Nenhuma tarefa concluída no período</p>
                <p className="text-theme-muted text-sm mt-2">Complete algumas tarefas para ver seu progresso aqui!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dynamicProgress.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4" title={item.fullDate}>
                    <span className="text-theme-secondary font-medium w-12 text-center">{item.label}</span>
                    <div className="flex-1 bg-theme-tertiary rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-tealLight to-tealDark rounded-full transition-all duration-500"
                        style={{ width: `${maxCompleted > 0 ? (item.completed / maxCompleted) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-theme-muted text-sm w-8 text-center">{item.completed}</span>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t task-card-divider">
                  <p className="text-theme-muted text-xs text-center">
                    Total do período: {dynamicProgress.reduce((sum, item) => sum + item.completed, 0)} tarefas concluídas
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Estatísticas por Categoria */}
          <div className="task-card p-6 rounded-xl shadow-theme">
            <h3 className="text-xl font-bold text-theme-primary mb-6">Desempenho por Categoria</h3>
            <div className="space-y-4">
              {categoryStats.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-theme-tertiary rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className={`w-3 h-3 rounded-full ${category.color}`}></span>
                    <span className="text-theme-secondary font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-theme-primary font-bold">{category.rate}%</div>
                    <div className="text-theme-muted text-xs">{category.completed}/{category.total}</div>
                  </div>
                </div>
              ))}
              {categoryStats.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-theme-muted">Nenhuma categoria com tarefas ainda</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Insights e Recomendações */}
        <div className="task-card p-8 rounded-xl shadow-theme">
          <h3 className="text-xl font-bold text-theme-primary mb-6">Insights e Recomendações</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Insight 1 */}
            <div className="bg-theme-tertiary p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-theme-secondary">Foco</h4>
              </div>
              <p className="text-theme-muted text-sm">
                {overdueTasks.length > 0 
                  ? `Você tem ${overdueTasks.length} tarefa(s) atrasada(s). Priorize-as!`
                  : "Parabéns! Nenhuma tarefa atrasada."
                }
              </p>
            </div>

            {/* Insight 2 */}
            <div className="bg-theme-tertiary p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-theme-secondary">Performance</h4>
              </div>
              <p className="text-theme-muted text-sm">
                {completionRate >= 80 
                  ? "Excelente taxa de conclusão! Continue assim."
                  : completionRate >= 60
                  ? "Boa performance. Tente melhorar um pouco mais."
                  : "Há espaço para melhorar. Foque nas prioridades."
                }
              </p>
            </div>

            {/* Insight 3 */}
            <div className="bg-theme-tertiary p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-theme-secondary">Pendentes</h4>
              </div>
              <p className="text-theme-muted text-sm">
                {pendingTasks.length === 0
                  ? "Parabéns! Nenhuma tarefa pendente."
                  : pendingTasks.length === 1
                  ? "Você tem 1 tarefa pendente para concluir."
                  : `Você tem ${pendingTasks.length} tarefas pendentes para concluir.`
                }
              </p>
            </div>

            {/* Insight 4 */}
            <div className="bg-theme-tertiary p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="font-semibold text-theme-secondary">
                  {period === 'week' ? 'Esta Semana' : period === 'month' ? 'Este Mês' : 'Este Ano'}
                </h4>
              </div>
              <p className="text-theme-muted text-sm">
                {(() => {
                  const completedInPeriod = periodTasks.filter(t => t.completed).length;
                  const createdInPeriod = periodTasks.length;
                  
                  if (createdInPeriod === 0) {
                    return `Nenhuma atividade no período selecionado.`;
                  }
                  
                  if (completedInPeriod === 0) {
                    return `${createdInPeriod} tarefa(s) criada(s), nenhuma concluída ainda.`;
                  }
                  
                  return `${completedInPeriod} de ${createdInPeriod} tarefa(s) concluída(s) no período.`;
                })()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}

export default Dashboard;


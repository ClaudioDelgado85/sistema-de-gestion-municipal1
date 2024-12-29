import React from 'react';
import { useTaskStore } from '../../../store/tasks';
import { Task } from '../../../types/task';
import { formatDistanceToNow, parseISO, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertTriangle } from 'lucide-react';

const UpcomingTasks = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const getUpcomingTasks = (tasks: Task[]) => {
    return tasks
      .filter((task) => {
        if (!task.plazo || task.estado === 'completada') return false;
        const plazoDate = parseISO(task.plazo);
        return isAfter(plazoDate, new Date());
      })
      .sort((a, b) => {
        const dateA = parseISO(a.plazo!);
        const dateB = parseISO(b.plazo!);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);
  };

  const upcomingTasks = getUpcomingTasks(tasks);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Tareas Próximas a Vencer</h3>
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
      </div>
      {upcomingTasks.length > 0 ? (
        <div className="space-y-4">
          {upcomingTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {task.tipo_acta.charAt(0).toUpperCase() + task.tipo_acta.slice(1)} -{' '}
                  {task.numero_acta}
                </p>
                <p className="text-sm text-gray-500">{task.infractor_nombre}</p>
              </div>
              <div className="text-sm text-yellow-600">
                Vence en{' '}
                {formatDistanceToNow(parseISO(task.plazo!), {
                  addSuffix: true,
                  locale: es,
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No hay tareas próximas a vencer</p>
      )}
    </div>
  );
};

export default UpcomingTasks;

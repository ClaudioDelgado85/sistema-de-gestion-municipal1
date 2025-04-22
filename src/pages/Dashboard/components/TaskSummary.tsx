import React from 'react';
import { useTaskStore } from '../../../store/tasks';
import { Task } from '../../../types/task';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface TaskStatusCount {
  pendiente: number;
  completada: number;
  vencida: number;
}

const TaskSummary = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const getTaskStatusCount = (tasks: Task[]): TaskStatusCount => {
    return tasks.reduce(
      (acc, task) => {
        if (task.estado === 'pendiente' || task.estado === 'completada' || task.estado === 'vencida') {
          acc[task.estado]++;
        }
        return acc;
      },
      { pendiente: 0, completada: 0, vencida: 0 } as TaskStatusCount
    );
  };

  const statusCount = getTaskStatusCount(tasks);

  const statusCards = [
    {
      status: 'Pendientes',
      count: statusCount.pendiente,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      description: 'Tareas con plazos',
    },
    {
      status: 'Completadas',
      count: statusCount.completada,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Tareas finalizadas',
    },
    {
      status: 'Vencidas',
      count: statusCount.vencida,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'Requieren atención',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statusCards.map((card) => (
        <div
          key={card.status}
          className={`relative overflow-hidden ${card.bgColor} rounded-lg border ${card.borderColor} transition-all duration-300 hover:shadow-md`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-600">{card.status}</h4>
                <div className="mt-2 flex items-baseline">
                  <p className={`text-2xl font-semibold ${card.color}`}>
                    {card.count}
                  </p>
                  <p className="ml-2 text-xs text-gray-500">{card.description}</p>
                </div>
              </div>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
          {/* Barra de progreso decorativa */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${card.color} opacity-20`}></div>
        </div>
      ))}
    </div>
  );
};

export default TaskSummary;

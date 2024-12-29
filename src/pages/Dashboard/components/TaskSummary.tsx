import React from 'react';
import { useTaskStore } from '../../../store/tasks';
import { Task, TaskStatus } from '../../../types/task';
import {
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface TaskStatusCount {
  pendiente: number;
  completada: number;
}

const TaskSummary = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const getTaskStatusCount = (tasks: Task[]): TaskStatusCount => {
    return tasks.reduce(
      (acc, task) => {
        if (task.estado === 'pendiente' || task.estado === 'completada') {
          acc[task.estado]++;
        }
        return acc;
      },
      { pendiente: 0, completada: 0 } as TaskStatusCount
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
    },
    {
      status: 'Completadas',
      count: statusCount.completada,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {statusCards.map((card) => (
        <div
          key={card.status}
          className={`p-4 rounded-lg shadow-sm ${card.bgColor}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.status}</p>
              <p className={`text-2xl font-semibold ${card.color}`}>
                {card.count}
              </p>
            </div>
            <card.icon className={`h-8 w-8 ${card.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskSummary;

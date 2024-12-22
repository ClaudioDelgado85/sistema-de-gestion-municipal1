import { Task } from '../../../types/task';
import { Edit } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
}

const statusColors = {
  pendiente: 'bg-lavender-100 text-lavender-800',
  completada: 'bg-green-100 text-green-800',
  vencida: 'bg-red-100 text-red-800',
};

function TaskList({ tasks, onEdit }: TaskListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-lavender-200">
        <thead className="bg-lavender-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-lavender-700 uppercase tracking-wider">
              Fecha
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-lavender-700 uppercase tracking-wider">
              Tipo
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-lavender-700 uppercase tracking-wider">
              Número
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-lavender-700 uppercase tracking-wider">
              Infractor
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-lavender-700 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Editar</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-lavender-200">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-lavender-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-lavender-900">
                {format(new Date(task.fecha), 'dd/MM/yyyy', { locale: es })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-lavender-900 capitalize">
                {task.tipoActa}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-lavender-900">
                {task.numeroActa}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-lavender-900">{task.infractor.nombre}</div>
                <div className="text-sm text-lavender-500">DNI: {task.infractor.dni}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[task.estado]}`}>
                  {task.estado}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(task)}
                  className="text-lavender-600 hover:text-lavender-900"
                >
                  <Edit className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../../types/task';
import { Edit, AlertTriangle, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTaskStore } from '../../store/tasks';
import { isTaskNearDeadline } from '../../utils/taskUtils';
import { cn } from '../../lib/utils';

interface TaskListProps {
  onEdit: (task: Task) => void;
}

const statusColors = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  completada: 'bg-green-100 text-green-800',
  vencida: 'bg-red-100 text-red-800',
};

interface StatusChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (observaciones: string) => void;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
}

function StatusChangeDialog({ isOpen, onClose, onConfirm, fromStatus, toStatus }: StatusChangeDialogProps) {
  const [observaciones, setObservaciones] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onConfirm(observaciones);
    setObservaciones('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Confirmar cambio de estado
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      ¿Estás seguro de que deseas cambiar el estado de {fromStatus} a {toStatus}?
                    </p>
                    <div className="mt-4">
                      <textarea
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={observaciones}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setObservaciones(e.target.value)}
                        placeholder="Ingrese las observaciones del cambio..."
                        required={fromStatus === 'vencida' && toStatus === 'completada'}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={onClose}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskList({ onEdit }: TaskListProps) {
  const { filters, sortConfig, setSortConfig, updateTaskStatus } = useTaskStore();
  
  const filteredTasks = useTaskStore((state) => 
    state.tasks.filter((task) => {
      if (filters.status.length && !filters.status.includes(task.estado)) return false;
      if (filters.type.length && !filters.type.includes(task.tipoActa)) return false;
      
      if (filters.dateRange.start || filters.dateRange.end) {
        const taskDate = new Date(task.fecha + 'T12:00:00');
        if (filters.dateRange.start && taskDate < new Date(filters.dateRange.start + 'T00:00:00')) return false;
        if (filters.dateRange.end && taskDate > new Date(filters.dateRange.end + 'T23:59:59')) return false;
      }
      
      return true;
    })
  );

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    taskId: string;
    fromStatus: TaskStatus;
    toStatus: TaskStatus;
  } | null>(null);

  // Verificar tareas vencidas al cargar el componente
  React.useEffect(() => {
    const checkOverdueTasks = () => {
      const now = new Date();
      filteredTasks.forEach(task => {
        if (task.estado === 'pendiente' && task.plazo) {
          const deadline = new Date(task.plazo);
          if (deadline < now) {
            updateTaskStatus({
              taskId: task.id,
              newStatus: 'vencida',
              observaciones: 'Tarea marcada automáticamente como vencida por sistema',
              usuario: 'sistema'
            });
          }
        }
      });
    };

    checkOverdueTasks();
  }, [filteredTasks, updateTaskStatus]);

  const handleSort = (key: keyof Task) => {
    setSortConfig({
      key,
      direction: 
        sortConfig.key === key && sortConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc',
    });
  };

  const sortedTasks = React.useMemo(() => {
    if (!sortConfig.key) return filteredTasks;
    
    return [...filteredTasks].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Task];
      const bValue = b[sortConfig.key as keyof Task];
      
      // Manejar casos especiales para diferentes tipos de valores
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      
      // Convertir fechas a timestamps para comparación
      if (sortConfig.key === 'fecha' || sortConfig.key === 'plazo') {
        const aDate = aValue ? new Date(aValue as string).getTime() : 0;
        const bDate = bValue ? new Date(bValue as string).getTime() : 0;
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      // Comparación estándar para strings y números
      return sortConfig.direction === 'asc' 
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [filteredTasks, sortConfig]);

  const handleStatusChange = (taskId: string, currentStatus: TaskStatus, newStatus: TaskStatus) => {
    setDialogState({
      isOpen: true,
      taskId,
      fromStatus: currentStatus,
      toStatus: newStatus
    });
  };

  const handleStatusChangeConfirm = (observaciones: string) => {
    if (!dialogState) return;

    updateTaskStatus({
      taskId: dialogState.taskId,
      newStatus: dialogState.toStatus,
      observaciones,
      usuario: 'usuario_actual' // Esto debería venir del contexto de autenticación
    });
    
    setDialogState(null);
  };

  return (
    <div className="overflow-x-auto">
      <StatusChangeDialog
        isOpen={!!dialogState}
        onClose={() => setDialogState(null)}
        onConfirm={handleStatusChangeConfirm}
        fromStatus={dialogState?.fromStatus || 'pendiente'}
        toStatus={dialogState?.toStatus || 'pendiente'}
      />
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('fecha')}
            >
              Fecha
              {sortConfig.key === 'fecha' && (
                <span className="ml-1">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Número
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Infractor
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('plazo')}
            >
              Plazo
              {sortConfig.key === 'plazo' && (
                <span className="ml-1">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedTasks.map((task) => {
            const isNearDeadline = isTaskNearDeadline(task);
            
            return (
              <tr 
                key={task.id} 
                className={cn(
                  "hover:bg-gray-50",
                  isNearDeadline && "bg-yellow-50"
                )}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(task.fecha + 'T12:00:00'), 'dd/MM/yyyy', { locale: es })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {task.tipoActa}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {task.numeroActa}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{task.infractor.nombre}</div>
                  <div className="text-sm text-gray-500">DNI: {task.infractor.dni}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex flex-col space-y-2 mt-2">
                    <div className="text-sm text-gray-500">
                      {task.plazo && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Plazo: {format(new Date(task.plazo + 'T12:00:00'), 'dd/MM/yyyy')}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Historial de Estados */}
                    {task.historialEstados && task.historialEstados.length > 0 && (
                      <div className="mt-2">
                        <details className="text-sm">
                          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                            Ver historial de cambios
                          </summary>
                          <div className="mt-2 pl-4 border-l-2 border-gray-200">
                            {task.historialEstados.map((cambio, index) => (
                              <div key={index} className="mb-2">
                                <div className="text-gray-600">
                                  {format(new Date(cambio.date + 'T12:00:00'), 'dd/MM/yyyy HH:mm')}
                                </div>
                                <div className="text-gray-700">
                                  De <span className="font-medium">{cambio.from}</span> a{' '}
                                  <span className="font-medium">{cambio.to}</span>
                                </div>
                                {cambio.observaciones && (
                                  <div className="text-gray-600">
                                    Observación: {cambio.observaciones}
                                  </div>
                                )}
                                <div className="text-gray-500 text-sm">
                                  Por: {cambio.usuario}
                                </div>
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <select
                      className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      value={task.estado}
                      onChange={(e) => handleStatusChange(task.id, task.estado, e.target.value as TaskStatus)}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="completada">Completada</option>
                      <option value="vencida">Vencida</option>
                    </select>
                    <span className={cn(
                      "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                      statusColors[task.estado]
                    )}>
                      {task.estado}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(task)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types/task';
import { Edit, Clock, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTaskStore } from '../../store/tasks';
import { cn } from '../../lib/utils';

interface TaskListProps {
  onEdit: (task: Task) => void;
  onDelete: (id: number) => Promise<void>;
  highlightTaskId?: number;
}

const statusColors: Record<TaskStatus, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_progreso: 'bg-blue-100 text-blue-800',
  completada: 'bg-green-100 text-green-800',
  completado: 'bg-green-100 text-green-800'
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
                        required
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

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskId: number;
}

function DeleteDialog({ isOpen, onClose, onConfirm }: DeleteDialogProps) {
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
                  Confirmar eliminación
                </h3>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    ¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.
                  </p>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={onConfirm}
                  >
                    Eliminar
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskList({ onEdit, onDelete, highlightTaskId }: TaskListProps) {
  const { sortConfig, setSortConfig, updateTaskStatus, getFilteredTasks } = useTaskStore();
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  // Obtener tareas filtradas
  const filteredTasks = useTaskStore(getFilteredTasks);

  const [statusDialogState, setStatusDialogState] = useState<{
    isOpen: boolean;
    taskId: number;
    fromStatus: TaskStatus;
    toStatus: TaskStatus;
  } | null>(null);

  const [deleteDialogState, setDeleteDialogState] = useState<{
    isOpen: boolean;
    taskId: number;
  } | null>(null);

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

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (sortConfig.key === 'fecha' || sortConfig.key === 'plazo') {
        const aDate = aValue ? new Date(aValue as string).getTime() : 0;
        const bDate = bValue ? new Date(bValue as string).getTime() : 0;
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }

      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [filteredTasks, sortConfig]);

  // Calcular paginación
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);

  // Funciones de navegación
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleStatusChange = (taskId: number, currentStatus: TaskStatus, newStatus: TaskStatus) => {
    setStatusDialogState({
      isOpen: true,
      taskId,
      fromStatus: currentStatus,
      toStatus: newStatus
    });
  };

  const handleStatusChangeConfirm = (observaciones: string) => {
    if (!statusDialogState) return;

    updateTaskStatus({
      taskId: statusDialogState.taskId,
      newStatus: statusDialogState.toStatus,
      observaciones
    });

    setStatusDialogState(null);
  };

  const handleDelete = (taskId: number) => {
    setDeleteDialogState({
      isOpen: true,
      taskId
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialogState) return;

    try {
      await onDelete(deleteDialogState.taskId);
      setDeleteDialogState(null);
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  return (
    <div>
      <StatusChangeDialog
        isOpen={!!statusDialogState}
        onClose={() => setStatusDialogState(null)}
        onConfirm={handleStatusChangeConfirm}
        fromStatus={statusDialogState?.fromStatus || 'pendiente'}
        toStatus={statusDialogState?.toStatus || 'pendiente'}
      />
      <DeleteDialog
        isOpen={!!deleteDialogState}
        onClose={() => setDeleteDialogState(null)}
        onConfirm={handleDeleteConfirm}
        taskId={deleteDialogState?.taskId || 0}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('fecha')}>Fecha{sortConfig.key === 'fecha' && (<span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>)}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Infractor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domicilio</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('plazo')}>Plazo{sortConfig.key === 'plazo' && (<span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>)}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTasks.map((task) => (
              <tr
                key={task.id}
                id={highlightTaskId === task.id ? `task-${task.id}` : undefined}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(task.fecha.includes('T') ? task.fecha : `${task.fecha}T12:00:00`), 'dd/MM/yyyy', { locale: es })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.tipo_acta}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.numero_acta}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{task.infractor_nombre}<br /><span className="text-gray-500">DNI: {task.infractor_dni}</span></td>
                <td className="px-6 py-4 text-sm text-gray-900">{task.infractor_domicilio}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{task.descripcion_falta}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {task.plazo && format(new Date(task.plazo.includes('T') ? task.plazo : `${task.plazo}T12:00:00`), 'dd/MM/yyyy', { locale: es })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap"><span className={cn('px-2 inline-flex text-xs leading-5 font-semibold rounded-full', statusColors[task.estado])}>{task.estado}</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(task)}
                      className="group relative text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-5 w-5" />
                      <span className="invisible group-hover:visible absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded">
                        Editar tarea
                      </span>
                    </button>
                    {task.estado === 'pendiente' && (
                      <button
                        onClick={() => handleStatusChange(task.id, task.estado, 'completada')}
                        className="text-green-600 hover:text-green-900"
                        title="Completar"
                      >
                        <Clock className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando{' '}
              <span className="font-medium">{indexOfFirstTask + 1}</span>
              {' '}-{' '}
              <span className="font-medium">
                {Math.min(indexOfLastTask, sortedTasks.length)}
              </span>
              {' '}de{' '}
              <span className="font-medium">{sortedTasks.length}</span>
              {' '}resultados
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Anterior</span>
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Números de página */}
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === idx + 1
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Siguiente</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskList;

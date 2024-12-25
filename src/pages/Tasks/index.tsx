import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import TaskList from '../../components/tasks/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilters from '../../components/tasks/TaskFilters';
import { Task, TaskFormData } from '../../types/task';
import { useTaskStore } from '../../store/tasks';
import { useTaskStatus } from '../../hooks/useTaskStatus';

function Tasks() {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { tasks, addTask, updateTask, fetchTasks } = useTaskStore();

  // Hook para manejar el estado de las tareas y notificaciones
  useTaskStatus(tasks);

  // Cargar tareas al montar el componente y cuando cambie el estado
  useEffect(() => {
    fetchTasks().catch(console.error);
  }, [fetchTasks]);

  const handleSubmit = async (data: TaskFormData) => {
    try {
      console.log('Datos recibidos:', data);
      if (editingTask) {
        await updateTask(editingTask.id, data);
      } else {
        await addTask({
          ...data,
          created_by: 1 // Por ahora hardcodeamos el usuario
        });
      }
      // Recargar las tareas después de crear/actualizar
      await fetchTasks();
      // Cerrar el formulario y limpiar el estado de edición
      setShowForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error al guardar la tarea:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Tareas</h2>
          <p className="mt-1 text-sm text-gray-500">
            Administre las tareas y actividades del sistema
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Tarea
        </button>
      </div>

      <TaskFilters />

      {showForm ? (
        <div className="bg-white shadow rounded-lg p-6">
          <TaskForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
            initialData={editingTask || undefined}
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <TaskList onEdit={handleEdit} />
        </div>
      )}
    </div>
  );
}

export default Tasks;
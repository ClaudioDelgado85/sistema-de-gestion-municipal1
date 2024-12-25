import { create } from 'zustand';
import { Task, TaskFormData, TaskStatus } from '../types/task';
import { taskService } from '../services/api';

interface TaskFilters {
  status: string[];
  type: string[];
  dateRange: {
    start: string | null;
    end: null;
  };
}

interface SortConfig {
  key: keyof Task | null;
  direction: 'asc' | 'desc';
}

interface TaskState {
  tasks: Task[];
  filters: TaskFilters;
  sortConfig: SortConfig;
  setFilters: (filters: Partial<TaskFilters>) => void;
  setSortConfig: (config: SortConfig) => void;
  fetchTasks: () => Promise<void>;
  addTask: (task: TaskFormData) => Promise<void>;
  updateTask: (id: number, task: TaskFormData) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  updateTaskStatus: (params: {
    taskId: number;
    newStatus: TaskStatus;
    observaciones: string;
  }) => Promise<void>;
}

const initialFilters: TaskFilters = {
  status: [],
  type: [],
  dateRange: {
    start: null,
    end: null,
  },
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  filters: initialFilters,
  sortConfig: { key: null, direction: 'asc' },

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setSortConfig: (config) =>
    set(() => ({
      sortConfig: config,
    })),

  fetchTasks: async () => {
    try {
      const tasks = await taskService.getAll();
      set({ tasks: tasks as Task[] });
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      throw error;
    }
  },

  addTask: async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      set((state) => ({
        tasks: [newTask as Task, ...state.tasks],
      }));
    } catch (error) {
      console.error('Error al crear tarea:', error);
      throw error;
    }
  },

  updateTask: async (id, taskData) => {
    try {
      const updatedTask = await taskService.update(id, taskData);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? (updatedTask as Task) : task
        ),
      }));
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      await taskService.delete(id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      throw error;
    }
  },

  updateTaskStatus: async ({ taskId, newStatus, observaciones }) => {
    try {
      // Encontrar la tarea actual en el estado
      const currentTask = useTaskStore.getState().tasks.find(t => t.id === taskId);
      if (!currentTask) {
        throw new Error('Tarea no encontrada');
      }

      // Crear un objeto TaskFormData con los datos actuales y el nuevo estado
      const updateData: TaskFormData = {
        fecha: currentTask.fecha,
        tipo_acta: currentTask.tipo_acta,
        numero_acta: currentTask.numero_acta,
        plazo: currentTask.plazo,
        infractor_nombre: currentTask.infractor_nombre,
        infractor_dni: currentTask.infractor_dni,
        infractor_domicilio: currentTask.infractor_domicilio,
        descripcion_falta: currentTask.descripcion_falta,
        observaciones,
        estado: newStatus,
        expediente_id: currentTask.expediente_id
      };

      // Actualizar la tarea
      const updatedTask = await taskService.update(taskId, updateData);
      
      // Actualizar el estado local
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? (updatedTask as Task) : t
        ),
      }));
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  },
}));
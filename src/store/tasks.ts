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
  isLoading: boolean;
  error: string | null;
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
  isLoading: false,
  error: null,

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setSortConfig: (config) =>
    set(() => ({
      sortConfig: config,
    })),

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('Iniciando fetchTasks...');
      const tasks = await taskService.getAll();
      console.log('Tareas cargadas desde la API:', tasks);
      // Asegurarse de que todas las tareas tengan los campos necesarios
      const processedTasks = tasks.map(task => ({
        ...task,
        fecha: task.fecha || task.created_at,
        estado: task.estado || 'pendiente'
      }));
      console.log('Tareas procesadas:', processedTasks);
      set({ tasks: processedTasks, isLoading: false, error: null });
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await taskService.create(taskData);
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error al crear tarea:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateTask: async (id, taskData) => {
    set({ isLoading: true, error: null });
    try {
      // Asegurarse de que taskData tenga todos los campos requeridos
      const currentTask = useTaskStore.getState().tasks.find(t => t.id === id);
      if (!currentTask) throw new Error('Tarea no encontrada');

      const updatedTaskData: TaskFormData = {
        fecha: taskData.fecha || currentTask.fecha,
        tipo_acta: taskData.tipo_acta || currentTask.tipo_acta,
        numero_acta: taskData.numero_acta || currentTask.numero_acta,
        infractor_nombre: taskData.infractor_nombre || currentTask.infractor_nombre,
        infractor_dni: taskData.infractor_dni || currentTask.infractor_dni,
        infractor_domicilio: taskData.infractor_domicilio || currentTask.infractor_domicilio,
        descripcion_falta: taskData.descripcion_falta || currentTask.descripcion_falta,
        estado: taskData.estado || currentTask.estado,
        plazo: taskData.plazo || currentTask.plazo,
        observaciones: taskData.observaciones || currentTask.observaciones,
        expediente_id: taskData.expediente_id || currentTask.expediente_id
      };

      const updatedTask = await taskService.update(id, updatedTaskData);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updatedTask } : task
        ),
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await taskService.delete(id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      set({ error: (error as Error).message, isLoading: false });
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
          t.id === taskId ? { ...t, ...updatedTask } : t
        ),
      }));
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  },
}));
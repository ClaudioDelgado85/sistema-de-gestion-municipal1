import { create } from 'zustand';
import { Task, TaskFormData, TaskStatus } from '../types/task';
import { MOCK_TASKS } from '../mocks/tasks';

interface TaskFilters {
  status: string[];
  type: string[];
  dateRange: {
    start: string | null;
    end: string | null;
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
  addTask: (task: TaskFormData) => void;
  updateTask: (id: string, task: TaskFormData) => void;
  updateTaskStatus: (params: {
    taskId: string;
    newStatus: TaskStatus;
    observaciones: string;
    usuario: string;
  }) => void;
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
  tasks: MOCK_TASKS,
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

  addTask: (taskData) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...taskData,
          id: Date.now().toString(),
          estado: 'pendiente',
          creadoPor: 'usuario_actual',
          historialEstados: [],
        },
      ],
    })),

  updateTask: (id, taskData) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...taskData,
            }
          : task
      ),
    })),

  updateTaskStatus: ({ taskId, newStatus, observaciones, usuario }) =>
    set((state) => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task || task.estado === newStatus) return state;

      const statusChange = {
        from: task.estado,
        to: newStatus,
        date: new Date().toLocaleDateString('en-CA'),  // Formato YYYY-MM-DD
        observaciones,
        usuario,
      };

      return {
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                estado: newStatus,
                historialEstados: [...t.historialEstados, statusChange],
              }
            : t
        ),
      };
    }),
}));
import { create } from 'zustand';
import { OtherActivity } from '../types/OtherActivity';
import { api } from '../services/api';

interface OtherActivitiesState {
  activities: OtherActivity[];
  isLoading: boolean;
  error: string | null;
  fetchActivities: () => Promise<void>;
  addActivity: (activity: Omit<OtherActivity, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateActivity: (id: number, activity: Partial<OtherActivity>) => Promise<void>;
  deleteActivity: (id: number) => Promise<void>;
}

export const useOtherActivitiesStore = create<OtherActivitiesState>((set) => ({
  activities: [],
  isLoading: false,
  error: null,

  fetchActivities: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('Iniciando fetchActivities...');
      const response = await api.get<OtherActivity[]>('/other-activities');
      console.log('Actividades cargadas desde la API:', response.data);
      set({ activities: response.data, isLoading: false, error: null });
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addActivity: async (activityData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<OtherActivity>('/other-activities', activityData);
      set((state) => ({
        activities: [...state.activities, response.data],
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error al crear actividad:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateActivity: async (id, activityData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch<OtherActivity>(`/other-activities/${id}`, activityData);
      set((state) => ({
        activities: state.activities.map((activity) =>
          activity.id === id ? { ...activity, ...response.data } : activity
        ),
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteActivity: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/other-activities/${id}`);
      set((state) => ({
        activities: state.activities.filter((activity) => activity.id !== id),
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));

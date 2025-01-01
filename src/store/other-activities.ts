import { create } from 'zustand';
import { OtherActivity, OtherActivityFormData } from '../types/other-activity';
import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: 'http://localhost:8080', // URL del backend
});

interface OtherActivityState {
  activities: OtherActivity[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addActivity: (activity: OtherActivityFormData) => Promise<void>;
  updateActivity: (id: number, activity: OtherActivityFormData) => Promise<void>;
  deleteActivity: (id: number) => Promise<void>;
  fetchActivities: () => Promise<void>;
  getFilteredActivities: () => OtherActivity[];
}

const useOtherActivityStore = create<OtherActivityState>((set, get) => ({
  activities: [],
  searchTerm: '',
  
  setSearchTerm: (term) => set({ searchTerm: term }),

  addActivity: async (activityData) => {
    try {
      console.log('Enviando datos al backend:', activityData);
      const response = await api.post<OtherActivity>('/api/other-activities', activityData);
      console.log('Respuesta del backend:', response.data);
      set((state) => ({
        activities: [...state.activities, response.data],
      }));
    } catch (error) {
      console.error('Error al agregar actividad:', error);
      throw error;
    }
  },

  updateActivity: async (id, activityData) => {
    try {
      console.log('Actualizando actividad en el backend:', id, activityData);
      const response = await api.put<OtherActivity>(`/api/other-activities/${id}`, activityData);
      console.log('Respuesta del backend:', response.data);
      set((state) => ({
        activities: state.activities.map((activity) =>
          activity.id === id ? response.data : activity
        ),
      }));
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
      throw error;
    }
  },

  deleteActivity: async (id) => {
    try {
      console.log('Eliminando actividad en el backend:', id);
      await api.delete(`/api/other-activities/${id}`);
      set((state) => ({
        activities: state.activities.filter((activity) => activity.id !== id),
      }));
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      throw error;
    }
  },

  fetchActivities: async () => {
    try {
      console.log('Obteniendo actividades del backend');
      const response = await api.get<OtherActivity[]>('/api/other-activities');
      console.log('Actividades obtenidas:', response.data);
      set({ activities: response.data });
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      throw error;
    }
  },

  getFilteredActivities: () => {
    const { activities, searchTerm } = get();
    if (!searchTerm) return activities;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return activities.filter((activity) =>
      activity.descripcion.toLowerCase().includes(lowerSearchTerm) ||
      activity.direccion.toLowerCase().includes(lowerSearchTerm) ||
      activity.observaciones?.toLowerCase().includes(lowerSearchTerm)
    );
  },
}));

export default useOtherActivityStore;

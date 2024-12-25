import axios from 'axios';
import { User, LoginCredentials } from '../types/api';
import { Task, TaskFormData } from '../types/task';
import { File } from '../types/api';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth Services
export const authService = {
    login: async (credentials: LoginCredentials) => {
        const response = await api.post<User>('/users/login', credentials);
        return response.data;
    },
};

// User Services
export const userService = {
    getAll: async () => {
        const response = await api.get<User[]>('/users');
        return response.data;
    },
    create: async (userData: Omit<User, 'id'> & { password: string }) => {
        const response = await api.post<User>('/users', userData);
        return response.data;
    },
};

// Task Services
export const taskService = {
    getAll: async () => {
        const response = await api.get<Task[]>('/tasks');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get<Task>(`/tasks/${id}`);
        return response.data;
    },
    create: async (taskData: TaskFormData) => {
        console.log('Datos originales:', JSON.stringify(taskData, null, 2));
        try {
            // Formatear las fechas al formato ISO
            const dataToSend = {
                ...taskData,
                fecha: new Date(taskData.fecha).toISOString(),
                plazo: taskData.plazo ? new Date(taskData.plazo).toISOString() : null,
                created_by: taskData.created_by || 1,
                expediente_id: taskData.expediente_id || null
            };
            
            console.log('Datos formateados a enviar:', JSON.stringify(dataToSend, null, 2));
            const response = await api.post<Task>('/tasks', dataToSend);
            console.log('Respuesta del servidor:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error detallado:', error.response?.data);
            console.error('Estado de la respuesta:', error.response?.status);
            console.error('Error al crear tarea:', error);
            throw error;
        }
    },
    update: async (id: number, taskData: TaskFormData) => {
        console.log('Actualizando tarea:', id, taskData);
        try {
            const response = await api.put<Task>(`/tasks/${id}`, taskData);
            console.log('Respuesta del servidor:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
            throw error;
        }
    },
    delete: async (id: number) => {
        try {
            await api.delete(`/tasks/${id}`);
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
            throw error;
        }
    }
};

// File Services
export const fileService = {
    getAll: async () => {
        const response = await api.get<File[]>('/files');
        return response.data;
    },
    create: async (fileData: any) => {
        console.log('Enviando datos al servidor:', fileData);
        try {
            const response = await api.post<File>('/files', fileData);
            return response.data;
        } catch (error) {
            console.error('Error al crear expediente:', error);
            throw error;
        }
    },
    update: async (id: number, fileData: any) => {
        console.log('Actualizando expediente:', id, fileData);
        try {
            const response = await api.put<File>(`/files/${id}`, fileData);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar expediente:', error);
            throw error;
        }
    },
    delete: async (id: number) => {
        try {
            await api.delete(`/files/${id}`);
        } catch (error) {
            console.error('Error al eliminar expediente:', error);
            throw error;
        }
    },
    getTasks: async (fileId: number) => {
        try {
            const response = await api.get<Task[]>(`/files/${fileId}/tasks`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener tareas de expediente:', error);
            throw error;
        }
    },
};

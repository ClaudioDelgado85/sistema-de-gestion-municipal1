import axios from 'axios';
import { User, LoginCredentials } from '../types/api';
import { Task, TaskFormData } from '../types/task';
import { File } from '../types/api';

const API_URL = 'http://localhost:8080/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth Services
export const authService = {
    login: async (credentials: LoginCredentials) => {
        try {
            const response = await api.post<{token: string, user: User}>('/users/login', credentials);
            localStorage.setItem('token', response.data.token);
            return response.data.user;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
    },
    logout: () => {
        localStorage.removeItem('token');
    }
};

// User Services
export const userService = {
    getAll: async () => {
        try {
            const response = await api.get<User[]>('/users');
            return response.data;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    },
    create: async (userData: Omit<User, 'id'> & { password: string }) => {
        try {
            const response = await api.post<User>('/users', userData);
            return response.data;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    },
};

// Task Services
export const taskService = {
    getAll: async () => {
        try {
            const response = await api.get<Task[]>('/tasks');
            return response.data;
        } catch (error) {
            console.error('Error al obtener tareas:', error);
            throw error;
        }
    },
    getById: async (id: number) => {
        try {
            const response = await api.get<Task>(`/tasks/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener tarea:', error);
            throw error;
        }
    },
    create: async (taskData: TaskFormData) => {
        console.log('Enviando datos al servidor:', taskData);
        try {
            const response = await api.post<Task>('/tasks', taskData);
            return response.data;
        } catch (error) {
            console.error('Error al crear tarea:', error);
            throw error;
        }
    },
    update: async (id: number, taskData: TaskFormData) => {
        console.log('Actualizando tarea:', id, taskData);
        try {
            const response = await api.put<Task>(`/tasks/${id}`, taskData);
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
        try {
            const response = await api.get<File[]>('/files');
            return response.data;
        } catch (error) {
            console.error('Error al obtener expedientes:', error);
            throw error;
        }
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

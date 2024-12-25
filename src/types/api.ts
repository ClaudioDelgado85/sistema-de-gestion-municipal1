export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

import { FileStatus } from './file';

export interface File {
  id: number;
  numeroExpediente: string;
  caratula: string;
  observaciones?: string;
  fecha: string;
  fechaSalida?: string | null;
  destino?: string | null;
  estado: FileStatus;
  created_by: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    assigned_to?: number;
    assigned_to_name?: string;
    file_id?: number;
    file_title?: string;
    created_by: number;
    created_at: string;
    updated_at: string;
}

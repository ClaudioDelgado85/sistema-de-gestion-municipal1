export type FileStatus = 'pendiente' | 'completado';

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

export interface FileFormData {
  numeroExpediente: string;
  caratula: string;
  observaciones?: string;
  fecha: string;
  fechaSalida?: string | null;
  destino?: string | null;
}

export interface SortConfig {
  key: keyof File | null;
  direction: 'asc' | 'desc';
}
export type FileStatus = 'en_proceso' | 'completado';

export interface File {
  id: string;
  fecha: string;
  numeroExpediente: string;
  caratula: string;
  fechaSalida?: string;
  destino?: string;
  estado: FileStatus;
  observaciones?: string;
}

export interface FileFormData extends Omit<File, 'id' | 'estado'> {}
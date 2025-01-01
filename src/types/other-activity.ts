export interface OtherActivity {
  id: number;
  fecha: string;
  descripcion: string;
  direccion: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OtherActivityFormData {
  fecha: string;
  descripcion: string;
  direccion: string;
  observaciones?: string;
}

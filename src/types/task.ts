export type TaskType = 'intimacion' | 'infraccion' | 'clausura' | 'decomiso' | 'habilitacion' | 'planos';
export type TaskStatus = 'pendiente' | 'completada' | 'vencida';

export interface StatusChange {
  from: TaskStatus;
  to: TaskStatus;
  date: string;
  observaciones: string;
  usuario: string;
}

export interface Task {
  id: string;
  fecha: string;
  tipoActa: TaskType;
  numeroActa: string;
  infractor: {
    nombre: string;
    dni: string;
    domicilio: string;
  };
  descripcionFalta: string;
  plazo?: string;
  observaciones?: string;
  estado: TaskStatus;
  creadoPor: string;
  historialEstados: StatusChange[];
}

export interface TaskFormData extends Omit<Task, 'id' | 'estado' | 'creadoPor' | 'historialEstados'> {}
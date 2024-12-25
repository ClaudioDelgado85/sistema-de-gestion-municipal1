export type TaskType = 'intimacion' | 'infraccion' | 'clausura' | 'decomiso' | 'habilitacion' | 'planos';
export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';

export interface Task {
    id: number;
    fecha: string;
    tipo_acta: TaskType;
    numero_acta: string;
    plazo?: string;
    infractor_nombre: string;
    infractor_dni: string;
    infractor_domicilio: string;
    descripcion_falta: string;
    observaciones?: string;
    estado: TaskStatus;
    expediente_id?: number;
    created_by: number;
    created_by_name?: string;
    created_at: string;
    updated_at: string;
}

export interface TaskFormData {
    fecha: string;
    tipo_acta: TaskType;
    numero_acta: string;
    plazo?: string;
    infractor_nombre: string;
    infractor_dni: string;
    infractor_domicilio: string;
    descripcion_falta: string;
    observaciones?: string;
    estado?: TaskStatus;
    expediente_id?: number;
    created_by?: number;
}
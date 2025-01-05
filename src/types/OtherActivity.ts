export type OtherActivityType = 'reunion' | 'inspeccion' | 'capacitacion' | 'otro';
export type OtherActivityStatus = 'pendiente' | 'en_progreso' | 'completada' | 'completado';

export interface OtherActivity {
    id: number;
    descripcion: string;
    tipo: OtherActivityType;
    estado: OtherActivityStatus;
    created_at: string;
    updated_at: string;
    created_by: number;
    created_by_name?: string;
}

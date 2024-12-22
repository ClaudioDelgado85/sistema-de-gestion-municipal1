import { Task } from '../types/task';

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    fecha: '2023-12-01',
    tipoActa: 'intimacion',
    numeroActa: 'INT-001',
    infractor: {
      nombre: 'Juan Pérez',
      dni: '12345678',
      domicilio: 'Calle 123'
    },
    descripcionFalta: 'Falta de habilitación comercial',
    plazo: '2023-12-15',
    estado: 'pendiente',
    creadoPor: 'admin',
    historialEstados: []
  },
  {
    id: '2',
    fecha: '2023-11-15',
    tipoActa: 'infraccion',
    numeroActa: 'INF-002',
    infractor: {
      nombre: 'María García',
      dni: '87654321',
      domicilio: 'Avenida 456'
    },
    descripcionFalta: 'Incumplimiento de normas sanitarias',
    estado: 'completada',
    creadoPor: 'admin',
    historialEstados: [
      {
        from: 'pendiente',
        to: 'completada',
        date: '2023-11-20',
        observaciones: 'Se regularizó la situación',
        usuario: 'admin'
      }
    ]
  }
];
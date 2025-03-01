import { Router, Request, Response } from 'express';
import { jsonDb } from '../utils/jsonDb';
import { v4 as uuidv4 } from 'uuid';

interface Task {
  id: string;
  fecha: string;
  tipo_acta: string;
  numero_acta: string;
  plazo: string | null;
  infractor_nombre: string;
  infractor_dni: string;
  infractor_domicilio: string;
  descripcion_falta: string;
  observaciones: string | null;
  estado: string;
  expediente_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface TasksData {
  tasks: Task[];
  intimations: any[];
  records: any[];
}

const router = Router();

// Obtener todas las tareas
router.get('/', async (_req: Request, res: Response) => {
  try {
    const data = await jsonDb.readData<TasksData>('tasks.json');
    res.json(data.tasks);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// Crear una nueva tarea
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('Datos recibidos:', req.body);
    
    const {
      fecha,
      tipo_acta,
      numero_acta,
      plazo,
      infractor_nombre,
      infractor_dni,
      infractor_domicilio,
      descripcion_falta,
      observaciones,
      estado,
      expediente_id,
      created_by
    } = req.body;

    // Validar campos requeridos
    if (!fecha || !tipo_acta || !numero_acta || !infractor_nombre || !descripcion_falta) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos',
        details: {
          fecha: !fecha,
          tipo_acta: !tipo_acta,
          numero_acta: !numero_acta,
          infractor_nombre: !infractor_nombre,
          descripcion_falta: !descripcion_falta
        }
      });
    }

    const data = await jsonDb.readData<TasksData>('tasks.json');

    const newTask: Task = {
      id: uuidv4(),
      fecha,
      tipo_acta,
      numero_acta,
      plazo: plazo || null,
      infractor_nombre,
      infractor_dni: infractor_dni || '',
      infractor_domicilio: infractor_domicilio || '',
      descripcion_falta,
      observaciones: observaciones || null,
      estado: estado || 'pendiente',
      expediente_id: expediente_id || null,
      created_by,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    data.tasks.push(newTask);
    await jsonDb.writeData('tasks.json', data);

    return res.json(newTask);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    return res.status(500).json({ error: 'Error al crear tarea' });
  }
});

// Actualizar una tarea existente
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const updateData = req.body;

    const data = await jsonDb.readData<TasksData>('tasks.json');
    const taskIndex = data.tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    // Actualizar la tarea
    const updatedTask = {
      ...data.tasks[taskIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    };

    data.tasks[taskIndex] = updatedTask;
    await jsonDb.writeData('tasks.json', data);

    return res.json(updatedTask);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    return res.status(500).json({ error: 'Error al actualizar tarea' });
  }
});

export default router;

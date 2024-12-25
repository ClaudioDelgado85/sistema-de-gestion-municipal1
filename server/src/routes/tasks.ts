import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// Obtener todas las tareas
router.get('/', async (_req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT 
                t.id,
                t.fecha,
                t.tipo_acta,
                t.numero_acta,
                t.plazo,
                t.infractor_nombre,
                t.infractor_dni,
                t.infractor_domicilio,
                t.descripcion_falta,
                t.observaciones,
                t.estado,
                t.expediente_id,
                t.created_by,
                t.created_at,
                t.updated_at,
                u.username as created_by_name,
                f.caratula as expediente_caratula
            FROM tasks t 
            LEFT JOIN users u ON t.created_by = u.id
            LEFT JOIN files f ON t.expediente_id = f.id
            ORDER BY t.created_at DESC
        `);
        res.json(result.rows);
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

        // Convertir campos vacíos a null
        const plazoValue = plazo || null;
        const observacionesValue = observaciones || null;
        const expedienteIdValue = expediente_id || null;
        const estadoValue = estado || 'pendiente';
        
        const result = await pool.query(
            `INSERT INTO tasks (
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
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
            RETURNING *`,
            [
                fecha,
                tipo_acta,
                numero_acta,
                plazoValue,
                infractor_nombre,
                infractor_dni,
                infractor_domicilio,
                descripcion_falta,
                observacionesValue,
                estadoValue,
                expedienteIdValue,
                created_by
            ]
        );
        
        console.log('Tarea creada:', result.rows[0]);

        // Obtener la tarea con información adicional
        const taskWithDetails = await pool.query(
            `SELECT 
                t.*,
                u.username as created_by_name,
                f.caratula as expediente_caratula
            FROM tasks t
            LEFT JOIN users u ON t.created_by = u.id
            LEFT JOIN files f ON t.expediente_id = f.id
            WHERE t.id = $1`,
            [result.rows[0].id]
        );

        res.json(taskWithDetails.rows[0]);
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ 
            error: 'Error al crear tarea',
            details: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});

// Actualizar una tarea
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log('Datos de actualización recibidos:', req.body);
        
        // Primero verificamos que la tarea exista
        const currentTask = await pool.query(
            'SELECT * FROM tasks WHERE id = $1',
            [id]
        );

        if (currentTask.rows.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

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
            expediente_id
        } = req.body;

        // Validar campos requeridos
        if (!fecha || !tipo_acta || !numero_acta || !infractor_nombre || !descripcion_falta) {
            return res.status(400).json({ 
                error: 'Faltan campos requeridos' 
            });
        }

        // Convertir campos vacíos a null
        const plazoValue = plazo || null;
        const observacionesValue = observaciones || null;
        const expedienteIdValue = expediente_id || null;
        const estadoValue = estado || 'pendiente';

        const result = await pool.query(
            `UPDATE tasks 
             SET fecha = $1,
                 tipo_acta = $2,
                 numero_acta = $3,
                 plazo = $4,
                 infractor_nombre = $5,
                 infractor_dni = $6,
                 infractor_domicilio = $7,
                 descripcion_falta = $8,
                 observaciones = $9,
                 estado = $10,
                 expediente_id = $11,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $12 
             RETURNING *`,
            [
                fecha,
                tipo_acta,
                numero_acta,
                plazoValue,
                infractor_nombre,
                infractor_dni,
                infractor_domicilio,
                descripcion_falta,
                observacionesValue,
                estadoValue,
                expedienteIdValue,
                id
            ]
        );

        // Obtener la tarea actualizada con información adicional
        const taskWithDetails = await pool.query(
            `SELECT 
                t.*,
                u.username as created_by_name,
                f.caratula as expediente_caratula
            FROM tasks t
            LEFT JOIN users u ON t.created_by = u.id
            LEFT JOIN files f ON t.expediente_id = f.id
            WHERE t.id = $1`,
            [id]
        );

        console.log('Tarea actualizada:', taskWithDetails.rows[0]);
        res.json(taskWithDetails.rows[0]);
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({ 
            error: 'Error al actualizar tarea',
            details: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});

// Eliminar una tarea
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({ error: 'Error al eliminar tarea' });
    }
});

export default router;

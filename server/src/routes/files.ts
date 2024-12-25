import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// Obtener todos los expedientes
router.get('/', async (_req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT 
                f.id,
                f.numeroexpediente as "numeroExpediente",
                f.caratula,
                f.observaciones,
                f.estado,
                f.fecha,
                f.fechasalida as "fechaSalida",
                f.destino,
                f.created_by,
                f.created_at,
                f.updated_at,
                u.username as created_by_name
            FROM files f
            LEFT JOIN users u ON f.created_by = u.id
            ORDER BY f.created_at DESC
        `);
        console.log('Expedientes encontrados:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener expedientes:', error);
        res.status(500).json({ error: 'Error al obtener expedientes' });
    }
});

// Crear un nuevo expediente
router.post('/', async (req: Request, res: Response) => {
    try {
        console.log('Datos recibidos:', req.body);
        
        const {
            numeroExpediente,
            caratula,
            observaciones,
            fecha,
            fechaSalida,
            destino,
            created_by
        } = req.body;

        // Validar campos requeridos
        if (!numeroExpediente || !caratula || !fecha) {
            return res.status(400).json({ 
                error: 'Los campos numeroExpediente, caratula y fecha son obligatorios' 
            });
        }

        // Convertir campos vacíos a null
        const fechaSalidaValue = fechaSalida || null;
        const destinoValue = destino || null;
        const observacionesValue = observaciones || null;
        const estado = fechaSalidaValue ? 'completado' : 'pendiente';
        
        const result = await pool.query(
            `INSERT INTO files (
                numeroexpediente,
                caratula,
                observaciones,
                estado,
                fecha,
                fechasalida,
                destino,
                created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *`,
            [
                numeroExpediente,
                caratula,
                observacionesValue,
                estado,
                fecha,
                fechaSalidaValue,
                destinoValue,
                created_by
            ]
        );
        
        console.log('Expediente creado:', result.rows[0]);

        // Obtener el expediente con el nombre del usuario
        const fileWithUser = await pool.query(
            `SELECT 
                f.id,
                f.numeroexpediente as "numeroExpediente",
                f.caratula,
                f.observaciones,
                f.estado,
                f.fecha,
                f.fechasalida as "fechaSalida",
                f.destino,
                f.created_by,
                f.created_at,
                f.updated_at,
                u.username as created_by_name
             FROM files f
             LEFT JOIN users u ON f.created_by = u.id
             WHERE f.id = $1`,
            [result.rows[0].id]
        );

        res.json(fileWithUser.rows[0]);
    } catch (error) {
        console.error('Error al crear expediente:', error);
        res.status(500).json({ 
            error: 'Error al crear expediente',
            details: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});

// Actualizar un expediente
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log('Datos de actualización recibidos:', req.body);
        
        // Primero obtenemos el expediente actual
        const currentFile = await pool.query(
            'SELECT * FROM files WHERE id = $1',
            [id]
        );

        if (currentFile.rows.length === 0) {
            return res.status(404).json({ error: 'Expediente no encontrado' });
        }

        const {
            caratula,
            observaciones,
            fecha,
            fechaSalida,
            destino
        } = req.body;

        // Validar campos requeridos
        if (!caratula || !fecha) {
            return res.status(400).json({ 
                error: 'Los campos caratula y fecha son obligatorios' 
            });
        }

        // Convertir campos vacíos a null
        const fechaSalidaValue = fechaSalida || null;
        const destinoValue = destino || null;
        const observacionesValue = observaciones || null;
        const estado = fechaSalidaValue ? 'completado' : 'pendiente';

        const result = await pool.query(
            `UPDATE files 
             SET caratula = $1,
                 observaciones = $2,
                 estado = $3,
                 fecha = $4,
                 fechasalida = $5,
                 destino = $6,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 
             RETURNING *`,
            [
                caratula,
                observacionesValue,
                estado,
                fecha,
                fechaSalidaValue,
                destinoValue,
                id
            ]
        );

        // Obtener el expediente actualizado con el nombre del usuario
        const fileWithUser = await pool.query(
            `SELECT f.*, u.username as created_by_name
             FROM files f
             LEFT JOIN users u ON f.created_by = u.id
             WHERE f.id = $1`,
            [id]
        );

        console.log('Expediente actualizado:', fileWithUser.rows[0]);
        res.json(fileWithUser.rows[0]);
    } catch (error) {
        console.error('Error al actualizar expediente:', error);
        res.status(500).json({ 
            error: 'Error al actualizar expediente',
            details: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});

// Obtener tareas por expediente
router.get('/:id/tasks', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT t.*, u.username as assigned_to_name
             FROM tasks t
             LEFT JOIN users u ON t.assigned_to = u.id
             WHERE t.file_id = $1
             ORDER BY t.created_at DESC`,
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tareas del expediente' });
    }
});

// Eliminar un expediente
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM files WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expediente no encontrado' });
        }

        res.json({ message: 'Expediente eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar expediente:', error);
        res.status(500).json({ error: 'Error al eliminar expediente' });
    }
});

export default router;

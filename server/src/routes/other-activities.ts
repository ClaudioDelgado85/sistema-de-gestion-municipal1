import { Router } from 'express';
import { Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /api/other-activities
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT * FROM other_activities ORDER BY fecha DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener actividades:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/other-activities
router.post('/', async (req: Request, res: Response) => {
    try {
        const { fecha, descripcion, direccion, observaciones } = req.body;
        const result = await pool.query(
            'INSERT INTO other_activities (fecha, descripcion, direccion, observaciones) VALUES ($1, $2, $3, $4) RETURNING *',
            [fecha, descripcion, direccion, observaciones]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear actividad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// PUT /api/other-activities/:id
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { fecha, descripcion, direccion, observaciones } = req.body;
        const result = await pool.query(
            'UPDATE other_activities SET fecha = $1, descripcion = $2, direccion = $3, observaciones = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [fecha, descripcion, direccion, observaciones, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Actividad no encontrada' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar actividad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// DELETE /api/other-activities/:id
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM other_activities WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Actividad no encontrada' });
        }
        
        res.json({ message: 'Actividad eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar actividad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;

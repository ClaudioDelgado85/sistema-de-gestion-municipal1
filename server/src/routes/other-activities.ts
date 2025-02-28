import { Router } from 'express';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const jsonFilePath = path.join(__dirname, '../data/other-activities.json');

// Helper function to read JSON file
const readJsonFile = () => {
  return JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
};

// Helper function to write JSON file
const writeJsonFile = (data: any) => {
  fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
};

// GET /api/other-activities
router.get('/', (_req: Request, res: Response) => {
    try {
        const jsonData = readJsonFile();
        return res.json(jsonData.activities);
    } catch (error) {
        console.error('Error al obtener actividades:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/other-activities
router.post('/', (req: Request, res: Response) => {
    try {
        const { fecha, descripcion, direccion, observaciones } = req.body;
        const jsonData = readJsonFile();
        
        const newActivity = {
            id: jsonData.activities.length > 0 ? Math.max(...jsonData.activities.map((a: any) => a.id)) + 1 : 1,
            fecha,
            descripcion,
            direccion,
            observaciones,
            estado: 'pendiente',
            created_by: 1, // ID por defecto del usuario
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        jsonData.activities.push(newActivity);
        writeJsonFile(jsonData);

        return res.status(201).json(newActivity);
    } catch (error) {
        console.error('Error al crear actividad:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// PUT /api/other-activities/:id
router.put('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { fecha, descripcion, direccion, observaciones } = req.body;
        const jsonData = readJsonFile();
        
        const activityIndex = jsonData.activities.findIndex((a: any) => a.id === parseInt(id));
        if (activityIndex === -1) {
            return res.status(404).json({ error: 'Actividad no encontrada' });
        }

        jsonData.activities[activityIndex] = {
            ...jsonData.activities[activityIndex],
            fecha,
            descripcion,
            direccion,
            observaciones,
            updated_at: new Date().toISOString()
        };
        
        writeJsonFile(jsonData);
        return res.json(jsonData.activities[activityIndex]);
    } catch (error) {
        console.error('Error al actualizar actividad:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// DELETE /api/other-activities/:id
router.delete('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const jsonData = readJsonFile();
        
        const activityIndex = jsonData.activities.findIndex((a: any) => a.id === parseInt(id));
        if (activityIndex === -1) {
            return res.status(404).json({ error: 'Actividad no encontrada' });
        }

        // Eliminar del archivo JSON
        jsonData.activities = jsonData.activities.filter((a: any) => a.id !== parseInt(id));
        writeJsonFile(jsonData);
        
        return res.json({ message: 'Actividad eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar actividad:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;

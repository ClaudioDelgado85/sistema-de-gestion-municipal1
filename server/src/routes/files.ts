import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();
const filesJsonPath = path.join(__dirname, '../data/files.json');

// Helper function to read files.json
const readFilesData = () => {
    const data = fs.readFileSync(filesJsonPath, 'utf8');
    return JSON.parse(data);
};

// Helper function to write to files.json
const writeFilesData = (data: any) => {
    fs.writeFileSync(filesJsonPath, JSON.stringify(data, null, 2));
};

// Get all files
router.get('/', (_req: Request, res: Response) => {
    try {
        const filesData = readFilesData();
        res.json(filesData.expedientes);
    } catch (error) {
        console.error('Error al obtener expedientes:', error);
        res.status(500).json({ error: 'Error al obtener expedientes' });
    }
});

// Create a new file
router.post('/', (req: Request, res: Response): Response => {
    try {
        const {
            numeroExpediente,
            caratula,
            observaciones,
            fecha,
            fechaSalida,
            destino,
            created_by
        } = req.body;

        // Validate required fields
        if (!numeroExpediente || !caratula || !fecha) {
            return res.status(400).json({
                error: 'Los campos numeroExpediente, caratula y fecha son obligatorios'
            });
        }

        const filesData = readFilesData();
        
        // Generate new ID
        const maxId = filesData.expedientes.reduce((max: number, file: any) => 
            file.id > max ? file.id : max, 0);
        
        const newFile = {
            id: maxId + 1,
            numeroExpediente: numeroExpediente,
            caratula,
            observaciones: observaciones || null,
            fecha,
            fechaSalida: fechaSalida || null,
            destino: destino || null,
            estado: fechaSalida ? 'completado' : 'pendiente',
            created_by,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        filesData.expedientes.push(newFile);
        writeFilesData(filesData);

        return res.json(newFile);
    } catch (error) {
        console.error('Error al crear expediente:', error);
        return res.status(500).json({
            error: 'Error al crear expediente',
            details: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});

// Update a file
router.put('/:id', (req: Request, res: Response): Response => {
    try {
        const { id } = req.params;
        const filesData = readFilesData();

        const fileIndex = filesData.expedientes.findIndex((file: any) => 
            file.id === parseInt(id));

        if (fileIndex === -1) {
            return res.status(404).json({ error: 'Expediente no encontrado' });
        }

        const {
            caratula,
            observaciones,
            fecha,
            fechaSalida,
            destino
        } = req.body;

        // Validate required fields
        if (!caratula || !fecha) {
            return res.status(400).json({
                error: 'Los campos caratula y fecha son obligatorios'
            });
        }

        const updatedFile = {
            ...filesData.expedientes[fileIndex],
            caratula,
            observaciones: observaciones || null,
            fecha,
            fechaSalida: fechaSalida || null,
            destino: destino || null,
            estado: fechaSalida ? 'completado' : 'pendiente',
            updated_at: new Date().toISOString()
        };

        filesData.expedientes[fileIndex] = updatedFile;
        writeFilesData(filesData);

        return res.json(updatedFile);
    } catch (error) {
        console.error('Error al actualizar expediente:', error);
        return res.status(500).json({
            error: 'Error al actualizar expediente',
            details: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});

// Delete a file
router.delete('/:id', (req: Request, res: Response): Response => {
    try {
        const { id } = req.params;
        const filesData = readFilesData();

        const fileIndex = filesData.expedientes.findIndex((file: any) => 
            file.id === parseInt(id));

        if (fileIndex === -1) {
            return res.status(404).json({ error: 'Expediente no encontrado' });
        }

        filesData.expedientes.splice(fileIndex, 1);
        writeFilesData(filesData);

        return res.json({ message: 'Expediente eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar expediente:', error);
        return res.status(500).json({
            error: 'Error al eliminar expediente',
            details: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});

export default router;

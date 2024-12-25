import { Router, Request, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcrypt';

const router = Router();

// Obtener todos los usuarios
router.get('/', async (_req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT id, username, email, full_name FROM users');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Crear un nuevo usuario
router.post('/', async (req: Request, res: Response) => {
    const { username, email, password, full_name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, full_name)
             VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name`,
            [username, email, hashedPassword, full_name]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const { password_hash, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
    } catch (error) {
        return res.status(500).json({ error: 'Error en el login' });
    }
});

export default router;

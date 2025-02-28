import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { jsonDb } from '../utils/jsonDb';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  password_hash: string;
}

interface UsersData {
  users: User[];
}

const router = Router();

// Obtener todos los usuarios
router.get('/', async (_req: Request, res: Response) => {
  try {
    const data = await jsonDb.readData<UsersData>('users.json');
    const usersWithoutPasswords = data.users.map(({ password_hash, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Crear un nuevo usuario
router.post('/', async (req: Request, res: Response) => {
  const { username, email, password, full_name } = req.body;
  try {
    const data = await jsonDb.readData<UsersData>('users.json');
    
    // Verificar si el usuario ya existe
    if (data.users.some(user => user.username === username)) {
      return res.status(400).json({ error: 'El nombre de usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      username,
      email,
      full_name,
      password_hash: hashedPassword
    };

    data.users.push(newUser);
    await jsonDb.writeData('users.json', data);

    const { password_hash, ...userWithoutPassword } = newUser;
    return res.json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const data = await jsonDb.readData<UsersData>('users.json');
    const user = data.users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

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

import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users';
import taskRoutes from './routes/tasks';
import fileRoutes from './routes/files';
import otherActivitiesRoutes from './routes/other-activities';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/other-activities', otherActivitiesRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

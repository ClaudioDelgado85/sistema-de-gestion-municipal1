-- Crear tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de expedientes
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    numeroexpediente VARCHAR(50) UNIQUE NOT NULL,
    caratula VARCHAR(200) NOT NULL,
    observaciones TEXT,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    fechasalida DATE,
    destino VARCHAR(200),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_status CHECK (estado IN ('pendiente', 'completado'))
);

-- Crear tabla de tareas
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    tipo_acta VARCHAR(50) NOT NULL,
    numero_acta VARCHAR(50) NOT NULL,
    plazo DATE,
    infractor_nombre VARCHAR(100) NOT NULL,
    infractor_dni VARCHAR(20) NOT NULL,
    infractor_domicilio TEXT NOT NULL,
    descripcion_falta TEXT NOT NULL,
    observaciones TEXT,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    expediente_id INTEGER REFERENCES files(id),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_estado CHECK (estado IN ('pendiente', 'en_progreso', 'completada')),
    CONSTRAINT valid_tipo_acta CHECK (tipo_acta IN ('intimacion', 'infraccion', 'clausura', 'decomiso', 'habilitacion', 'planos'))
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_tasks_estado ON tasks(estado);
CREATE INDEX idx_tasks_tipo_acta ON tasks(tipo_acta);
CREATE INDEX idx_tasks_expediente_id ON tasks(expediente_id);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_fecha ON tasks(fecha);
CREATE INDEX idx_tasks_numero_acta ON tasks(numero_acta);

-- Crear función para actualizar el timestamp de actualización
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar automáticamente updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at
    BEFORE UPDATE ON files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

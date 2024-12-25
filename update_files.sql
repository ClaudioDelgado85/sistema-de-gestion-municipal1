-- Actualizar los estados existentes
UPDATE files 
SET status = CASE 
    WHEN fecha_salida IS NOT NULL THEN 'completado' 
    ELSE 'pendiente' 
END;

-- Quitar la restricción si existe
ALTER TABLE files 
    DROP CONSTRAINT IF EXISTS valid_status;

-- Agregar la nueva restricción
ALTER TABLE files 
    ADD CONSTRAINT valid_status CHECK (status IN ('pendiente', 'completado'));

-- Configurar el valor por defecto
ALTER TABLE files 
    ALTER COLUMN status SET DEFAULT 'pendiente';

-- Agregar la columna fecha
ALTER TABLE files 
    ADD COLUMN IF NOT EXISTS fecha DATE NOT NULL DEFAULT CURRENT_DATE;

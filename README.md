# Sistema de Gestión Municipal

Este es un sistema de gestión municipal que permite administrar tareas, archivos y actividades municipales.

## Requisitos Previos

- Node.js (v16 o superior)
- npm (v8 o superior)
- Docker y Docker Compose (para ejecución con contenedores)

## Ejecutar con npm (Desarrollo)

1. Instalar dependencias del frontend:
```bash
cd sistema-de-gestion-municipal1
npm install
```

2. Instalar dependencias del backend:
```bash
cd server
npm install
```

3. Iniciar el servidor backend:
```bash
cd server
npm run dev
```
El servidor backend se ejecutará en `http://localhost:3000`

4. En otra terminal, iniciar el frontend:
```bash
cd sistema-de-gestion-municipal1
npm run dev
```
La aplicación frontend estará disponible en `http://localhost:5173`

## Ejecutar con Docker

1. Construir y levantar los contenedores:
```bash
docker-compose up --build
```

Esto iniciará todos los servicios:
- Frontend: `http://localhost:80`
- Backend: `http://localhost:3000`
- Base de datos: Puerto `5432` (PostgreSQL)

Para detener los contenedores:
```bash
docker-compose down
```

## Puertos Utilizados

### Modo Desarrollo (npm)
- Frontend: 5173
- Backend: 3000
- Base de datos: 5432

### Modo Producción (Docker)
- Frontend: 80
- Backend: 3000
- Base de datos: 5432
# Sistema de Gestión Municipal

Este es un sistema de gestión municipal que permite administrar tareas, archivos y actividades municipales.

## Requisitos Previos

- Node.js (v16 o superior)
- npm (v8 o superior)

## Instalación y Ejecución

### Primera vez (nuevo ordenador)

#### Opción 1 (paso a paso):
```bash
# 1. Clonar el repositorio
git clone <tu-repositorio>
cd <tu-repositorio>

# 2. Cambiar a la rama json-version
git checkout json-version

# 3. Instalar todas las dependencias
npm run install-all

# 4. Iniciar el proyecto
npm run dev:all
```

#### Opción 2 (comando único):
```bash
# 1. Clonar el repositorio
git clone <tu-repositorio>
cd <tu-repositorio>

# 2. Cambiar a la rama json-version
git checkout json-version

# 3. Instalar dependencias e iniciar el proyecto
npm run setup
```

### Uso diario
```bash
npm run dev:all
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

Para detener la aplicación: Presionar `Ctrl+C` en la terminal.

## Comandos Disponibles

| Comando | Descripción | Cuándo Usar |
|---------|-------------|-------------|
| `npm run setup` | Instala dependencias e inicia el proyecto | Primera vez (opción rápida) |
| `npm run install-all` | Instala dependencias del frontend y backend | Primera vez, cambios de rama, nuevas dependencias |
| `npm run dev:all` | Inicia frontend y backend concurrentemente | Uso diario para desarrollo |

## Notas Importantes

- Ejecutar `npm run install-all` si:
  - Es la primera vez que clonas el proyecto
  - Cambias entre ramas
  - Se añaden nuevas dependencias
  - Hay cambios en package.json

- Para desarrollo diario, solo necesitas `npm run dev:all`

## Versión Docker (Alternativa)

Si prefieres usar Docker, puedes ejecutar:

```bash
docker-compose up --build
```

Esto iniciará:
- Frontend: http://localhost:80
- Backend: http://localhost:3000
- Base de datos: Puerto 5432 (PostgreSQL)

Para detener Docker:
```bash
docker-compose down
```

## Puertos Utilizados

### Modo Desarrollo (npm)
- Frontend: 5173
- Backend: 3000

### Modo Producción (Docker)
- Frontend: 80
- Backend: 3000
- Base de datos: 5432

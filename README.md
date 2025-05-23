## Requisitos 
- Docker

### Docker

Construir y ejecutar los contenedores:

```bash
docker-compose up --build
```

```bash
docker-compose down
```

## Endpoints
Actualmente solo hay get:
http://localhost:3000/api/*

`EN PROGRESO`

## Variables de entorno

Para que el proyecto funcione correctamente, hagan un .env con estas cosas:

```
PORT=3000
NODE_ENV=development
DB_HOST = db
DB_USER = postgres
DB_DATABASE = mecanicodb
DB_PORT = 5432
DB_PASSWORD = 123

```

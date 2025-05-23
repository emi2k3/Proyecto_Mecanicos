# API REST Mecánicos

API REST desarrollada con Node.js, Express y Docker.

## Requisitos previos

- Node.js (v18 o superior)
- Docker
- Docker Compose

## Instalación y ejecución

### Desarrollo local sin Docker

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

### Usando Docker

1. Construir y ejecutar los contenedores:

```bash
docker-compose up --build
```

2. Para ejecutar en segundo plano:

```bash
docker-compose up -d
```

3. Para detener los contenedores:

```bash
docker-compose down
```

## Endpoints

- `GET /`: Endpoint de bienvenida y estado de la API

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
PORT=3000
NODE_ENV=development
```

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
Clientes

    GET Todos: GET http://localhost:3000/api/clientes/

    GET por ID: GET http://localhost:3000/api/clientes/:id

    POST Crear: POST http://localhost:3000/api/clientes/

    PUT Editar: PUT http://localhost:3000/api/clientes/:id

    DELETE Borrar: DELETE http://localhost:3000/api/clientes/:id

Mecánicos

    GET Todos: GET http://localhost:3000/api/mecanicos/

    GET por ID: GET http://localhost:3000/api/mecanicos/:id

    POST Crear: POST http://localhost:3000/api/mecanicos/

    PUT Editar: PUT http://localhost:3000/api/mecanicos/:id

    DELETE Borrar: DELETE http://localhost:3000/api/mecanicos/:id

Repuestos

    GET Todos: GET http://localhost:3000/api/repuestos/

    GET por ID: GET http://localhost:3000/api/repuestos/:id

    POST Crear: POST http://localhost:3000/api/repuestos/

    PUT Editar: PUT http://localhost:3000/api/repuestos/:id

    DELETE Borrar: DELETE http://localhost:3000/api/repuestos/:id

Teléfonos

    GET Todos: GET http://localhost:3000/api/telefonos/

    GET por ID: GET http://localhost:3000/api/telefonos/:id

    POST Crear: POST http://localhost:3000/api/telefonos/

    PUT Editar: PUT http://localhost:3000/api/telefonos/:id

    DELETE Borrar: DELETE http://localhost:3000/api/telefonos/:id

Vehículos

    GET Todos: GET http://localhost:3000/api/vehiculos/

    GET por ID: GET http://localhost:3000/api/vehiculos/:id

    POST Crear: POST http://localhost:3000/api/vehiculos/

    PUT Editar: PUT http://localhost:3000/api/vehiculos/:id

    DELETE Borrar: DELETE http://localhost:3000/api/vehiculos/:id

Reparaciones

    GET Todas: GET http://localhost:3000/api/reparaciones/

    GET por ID: GET http://localhost:3000/api/reparaciones/:id

    POST Crear: POST http://localhost:3000/api/reparaciones/

    PUT Editar: PUT http://localhost:3000/api/reparaciones/:id

    DELETE Borrar: DELETE http://localhost:3000/api/reparaciones/:id


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

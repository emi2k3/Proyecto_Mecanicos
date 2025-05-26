# 🔧 Sistema de Gestión de Mecánica

Sistema completo para la gestión de talleres mecánicos.

## 📋 Requisitos

- **Docker** 

## 🚀 Instalación y Configuración

### 1. Variables de Entorno

Archivo  `.env` que va en la raíz del proyecto con la siguiente configuración:

```env
PORT=3000
NODE_ENV=development
DB_HOST=db
DB_USER=postgres
DB_DATABASE=mecanicodb
DB_PORT=5432
DB_PASSWORD=123
```

### 2. Ejecutar con Docker

**Construir y ejecutar los contenedores:**
```bash
docker-compose up --build
```

**Detener los contenedores:**
```bash
docker-compose down
```

## 📚 API Endpoints

La API estará disponible en `http://localhost:3000/api/`

### 👥 Clientes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/clientes/` | Obtener todos los clientes |
| `GET` | `/api/clientes/:id` | Obtener cliente por ID |
| `POST` | `/api/clientes/` | Crear nuevo cliente |
| `PUT` | `/api/clientes/:id` | Actualizar cliente |
| `DELETE` | `/api/clientes/:id` | Eliminar cliente |

### 🔧 Mecánicos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/mecanicos/` | Obtener todos los mecánicos |
| `GET` | `/api/mecanicos/:id` | Obtener mecánico por ID |
| `POST` | `/api/mecanicos/` | Crear nuevo mecánico |
| `PUT` | `/api/mecanicos/:id` | Actualizar mecánico |
| `DELETE` | `/api/mecanicos/:id` | Eliminar mecánico |

### 🛠️ Repuestos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/repuestos/` | Obtener todos los repuestos |
| `GET` | `/api/repuestos/:id` | Obtener repuesto por ID |
| `POST` | `/api/repuestos/` | Crear nuevo repuesto |
| `PUT` | `/api/repuestos/:id` | Actualizar repuesto |
| `DELETE` | `/api/repuestos/:id` | Eliminar repuesto |

### 📞 Teléfonos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/telefonos/` | Obtener todos los teléfonos |
| `GET` | `/api/telefonos/:id` | Obtener teléfono por ID |
| `POST` | `/api/telefonos/` | Crear nuevo teléfono |
| `PUT` | `/api/telefonos/:id` | Actualizar teléfono |
| `DELETE` | `/api/telefonos/:id` | Eliminar teléfono |

### 🚗 Vehículos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/vehiculos/` | Obtener todos los vehículos |
| `GET` | `/api/vehiculos/:id` | Obtener vehículo por ID |
| `POST` | `/api/vehiculos/` | Crear nuevo vehículo |
| `PUT` | `/api/vehiculos/:id` | Actualizar vehículo |
| `DELETE` | `/api/vehiculos/:id` | Eliminar vehículo |

### 🔨 Reparaciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/reparaciones/` | Obtener todas las reparaciones |
| `GET` | `/api/reparaciones/:id` | Obtener reparación por ID |
| `POST` | `/api/reparaciones/` | Crear nueva reparación |
| `PUT` | `/api/reparaciones/:id` | Actualizar reparación |
| `DELETE` | `/api/reparaciones/:id` | Eliminar reparación |

FALTA MECANICO REPARACIONES

## ✉️ Postman

En la carpeta de Postman están exportadas las rutas con valores de ejemplo para facilitar las pruebas de la API.

## 🛡️ Tecnologías

- **Backend**: Node.js
- **Base de Datos**: PostgreSQL
- **Containerización**: Docker 


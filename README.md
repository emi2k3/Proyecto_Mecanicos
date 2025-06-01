# 🔧 Sistema de Gestión de Mecánica
Sistema completo para la gestión de talleres mecánicos.

## 📋 Requisitos
- **Docker**
- **Node.js (versión 18 o superior)**
- **Android Studio (CON SU DEVELOPMENT KIT)**
- **JDK 17**
- **Java Development Kit (JDK)**

## 🚀 Instalación y Configuración

### 1. Instalar los programas necesarios:
- Node.js (versión 18 o superior)
- Android Studio
- Java Development Kit (JDK)

### 2. En Android Studio:
- Instalar Android SDK
- Crear un emulador (AVD)
- Asegurarte de que el emulador funcione

### 3. Configurar variables de entorno:
- JAVA_HOME (apuntando a tu JDK)
- ANDROID_HOME (apuntando a tu Android SDK)
- Agregar a Path: platform-tools y tools de Android

### 4. Variables de Entorno del Sistema

En nuestro sistema operativo debemos crear las variables:
- **JAVA_HOME** (apuntando al JDK)
- **ANDROID_HOME** (apuntando al Android SDK)

Luego en **PATH** debemos agregar lo siguiente:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
%JAVA_HOME%\bin
```

### 5. Configuración del Proyecto

Archivo `.env` que va en la raíz del proyecto con la siguiente configuración:
```env
PORT=3000
NODE_ENV=development
DB_HOST=db
DB_USER=postgres
DB_DATABASE=mecanicodb
DB_PORT=5432
DB_PASSWORD=123
```

### 6. En el proyecto:
**Instalar dependencias:**
```bash
npm install
```

**Instalar específicamente estas versiones que sabemos que funcionan:**
```bash
npm install @react-native-async-storage/async-storage@1.21.0
npm install axios@1.9.0
```

### 7. Para ejecutar:
- Primero abre el emulador desde Android Studio
- En una terminal: `npm start`
- En otra terminal: `npm run android`

Si algo falla, el comando más útil es:
```bash
npm run android
```

### 8. Ejecutar con Docker

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

**NOTA:** FALTA MECANICO REPARACIONES

## ✉️ Postman
En la carpeta de Postman están exportadas las rutas con valores de ejemplo para facilitar las pruebas de la API.

## 🛡️ Tecnologías
- **Backend**: Node.js
- **Base de Datos**: PostgreSQL
- **Containerización**: Docker
- **Mobile**: React Native

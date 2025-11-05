#  Backend - Sistema de Administración Fábrica Textil

Backend desarrollado con Node.js + Express para la gestión de actividades y trabajadores de una fábrica textil.

##  Características

-  Autenticación con JWT (access token + refresh token)
-  3 roles de usuario: Admin, Encargado, Trabajador
-  CRUD completo de Usuarios, Áreas y Actividades
-  Sistema de asignación de tareas a trabajadores
-  Comentarios y seguimiento de actividades
-  Protección de rutas por roles
-  OAuth con Google/Facebook (opcional)
-  Base de datos MySQL con creación automática

## 🛠️ Tecnologías

- **Node.js** v18+
- **Express** v4.18
- **MySQL2** v3.6
- **JWT** (jsonwebtoken)
- **Bcrypt** para encriptación
- **Dotenv** para variables de entorno

##  Instalación

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=fabrica_textil
JWT_SECRET=tu_secret_muy_seguro
JWT_REFRESH_SECRET=tu_refresh_secret_muy_seguro
FRONTEND_URL=http://localhost:19006
```

### 3. Crear base de datos (Opción A - Automática)

El servidor creará automáticamente la base de datos al iniciar si no existe.

```bash
npm start
```

### 3. Crear base de datos (Opción B - Manual)

Ejecutar el script SQL en MySQL:

```bash
mysql -u root -p < database/fabrica_textil.sql
```

O desde MySQL Workbench/phpMyAdmin, importar el archivo `fabrica_textil.sql`.

##  Ejecutar servidor

### Modo producción
```bash
npm start
```

### Modo desarrollo (con nodemon)
```bash
npm run dev
```

El servidor estará disponible en:
- **Local**: `http://localhost:5000`
- **Red local**: `http://TU_IP:5000` (se muestra en consola)

##  Documentación de API

### Base URL
```
http://localhost:5000
```

### Autenticación

#### 1. Registro de usuario
```http
POST /auth/registro
Content-Type: application/json

{
  "usuario": "nuevo_usuario",
  "password": "password123",
  "email": "usuario@ejemplo.com",
  "nombre_completo": "Juan Pérez",
  "telefono": "1234567890",
  "rol": "trabajador",
  "area_id": 1,
  "puesto": "Operario"
}
```

**Respuesta exitosa (201):**
```json
{
  "exito": true,
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": 10,
    "usuario": "nuevo_usuario",
    "email": "usuario@ejemplo.com",
    "nombre_completo": "Juan Pérez",
    "rol": "trabajador",
    "provider": "local"
  }
}
```

#### 2. Login
```http
POST /auth/login
Content-Type: application/json

{
  "usuario": "admin",
  "password": "admin123"
}
```

**Respuesta exitosa (200):**
```json
{
  "exito": true,
  "mensaje": "Login exitoso",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 1,
    "usuario": "admin",
    "email": "admin@fabricatextil.com",
    "nombre_completo": "Administrador Sistema",
    "rol": "admin",
    "telefono": null,
    "foto_perfil": null,
    "provider": "local",
    "creado_en": "2025-01-15T10:30:00.000Z"
  }
}
```

#### 3. Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 4. OAuth (Google/Facebook)
```http
POST /auth/oauth
Content-Type: application/json

{
  "provider": "google",
  "provider_id": "1234567890",
  "email": "usuario@gmail.com",
  "nombre": "Juan Pérez",
  "foto": "https://...",
  "rol": "trabajador"
}
```

---

### Usuarios

**Todas las rutas de usuarios requieren autenticación** (Header: `Authorization: Bearer TOKEN`)

#### Listar usuarios (Admin)
```http
GET /usuarios
Authorization: Bearer {accessToken}
```

#### Obtener usuario por ID
```http
GET /usuarios/:id
Authorization: Bearer {accessToken}
```

#### Actualizar perfil
```http
PUT /usuarios/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "nombre_completo": "Juan Pérez Actualizado",
  "telefono": "9876543210",
  "foto_perfil": "base64_image..."
}
```

#### Cambiar rol (Solo Admin)
```http
PUT /usuarios/:id/rol
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "rol": "encargado"
}
```

---

### Áreas

#### Listar áreas
```http
GET /areas
Authorization: Bearer {accessToken}
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Tejido",
    "descripcion": "Área de producción de tejidos",
    "responsable_id": 2,
    "responsable_nombre": "Juan Pérez",
    "total_trabajadores": 5,
    "total_actividades": 3,
    "activo": true,
    "creado_en": "2025-01-15T10:00:00.000Z"
  }
]
```

#### Obtener área por ID
```http
GET /areas/:id
Authorization: Bearer {accessToken}
```

#### Crear área (Admin)
```http
POST /areas
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "nombre": "Área Nueva",
  "descripcion": "Descripción del área",
  "responsable_id": 2
}
```

#### Actualizar área (Admin)
```http
PUT /areas/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "nombre": "Área Actualizada",
  "descripcion": "Nueva descripción",
  "responsable_id": 3
}
```

#### Eliminar área (Admin)
```http
DELETE /areas/:id
Authorization: Bearer {accessToken}
```

---

### Actividades

#### Listar actividades (con filtros)
```http
GET /actividades?area_id=1&estado=Pendiente&encargado_id=2
Authorization: Bearer {accessToken}
```

**Filtros disponibles:**
- `area_id`: Filtrar por área
- `estado`: Pendiente, En Progreso, Finalizada, Bloqueada, Cancelada
- `encargado_id`: Filtrar por encargado

**Nota:** 
- Los **trabajadores** solo ven sus actividades asignadas
- Los **encargados** solo ven las actividades que gestionan
- Los **admins** ven todas

**Respuesta:**
```json
[
  {
    "id": 1,
    "titulo": "Producción lote tela denim",
    "descripcion": "Producir 500 metros...",
    "prioridad": "Alta",
    "estado": "En Progreso",
    "area_id": 1,
    "area_nombre": "Tejido",
    "encargado_id": 2,
    "encargado_nombre": "Juan Pérez",
    "creado_por": 1,
    "creado_por_nombre": "Admin",
    "fecha_inicio": "2025-01-15T08:00:00.000Z",
    "fecha_fin_estimada": "2025-01-18T17:00:00.000Z",
    "fecha_fin_real": null,
    "total_trabajadores": 2,
    "creado_en": "2025-01-15T07:00:00.000Z",
    "actualizado_en": "2025-01-15T09:30:00.000Z"
  }
]
```

#### Obtener actividad por ID
```http
GET /actividades/:id
Authorization: Bearer {accessToken}
```

**Respuesta incluye:** trabajadores asignados y comentarios

#### Crear actividad (Admin/Encargado)
```http
POST /actividades
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "titulo": "Nueva actividad",
  "descripcion": "Descripción detallada",
  "area_id": 1,
  "encargado_id": 2,
  "prioridad": "Alta",
  "fecha_inicio": "2025-01-20T08:00:00",
  "fecha_fin_estimada": "2025-01-25T17:00:00"
}
```

#### Actualizar actividad (Admin/Encargado)
```http
PUT /actividades/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "titulo": "Actividad actualizada",
  "descripcion": "Nueva descripción",
  "prioridad": "Media",
  "estado": "En Progreso",
  "fecha_inicio": "2025-01-20T08:00:00",
  "fecha_fin_estimada": "2025-01-25T17:00:00",
  "fecha_fin_real": null
}
```

#### Eliminar actividad (Admin)
```http
DELETE /actividades/:id
Authorization: Bearer {accessToken}
```

#### Asignar trabajadores (Admin/Encargado)
```http
POST /actividades/:id/asignar
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "trabajadores": [
    {
      "trabajador_id": 4,
      "rol_en_actividad": "Operador Principal"
    },
    {
      "trabajador_id": 5,
      "rol_en_actividad": "Asistente"
    }
  ]
}
```

#### Agregar comentario
```http
POST /actividades/:id/comentarios
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "mensaje": "Actividad avanzando según lo planeado"
}
```

#### Obtener comentarios
```http
GET /actividades/:id/comentarios
Authorization: Bearer {accessToken}
```

---

### Dashboard / Estadísticas

#### Obtener estadísticas
```http
GET /dashboard/stats
Authorization: Bearer {accessToken}
```

**Respuesta para Admin:**
```json
{
  "totalUsuarios": 15,
  "totalAreas": 8,
  "totalActividades": 25,
  "actividadesPorEstado": [
    { "estado": "Pendiente", "cantidad": 10 },
    { "estado": "En Progreso", "cantidad": 8 },
    { "estado": "Finalizada", "cantidad": 7 }
  ]
}
```

**Respuesta para Encargado:**
```json
{
  "misActividades": 12,
  "actividadesPorEstado": [...],
  "trabajadoresEnMiArea": 6
}
```

**Respuesta para Trabajador:**
```json
{
  "misActividades": 4,
  "actividadesPorEstado": [...]
}
```

---

##  Roles y Permisos

| Endpoint | Admin | Encargado | Trabajador |
|----------|-------|-----------|------------|
| GET /usuarios | ✅ | ❌ | ❌ |
| PUT /usuarios/:id/rol | ✅ | ❌ | ❌ |
| POST /areas | ✅ | ❌ | ❌ |
| PUT /areas/:id | ✅ | ❌ | ❌ |
| DELETE /areas/:id | ✅ | ❌ | ❌ |
| GET /actividades | ✅ Todas | ✅ Sus áreas | ✅ Asignadas |
| POST /actividades | ✅ | ✅ | ❌ |
| PUT /actividades/:id | ✅ | ✅ | ❌ |
| DELETE /actividades/:id | ✅ | ❌ | ❌ |
| POST /actividades/:id/asignar | ✅ | ✅ | ❌ |
| POST /actividades/:id/comentarios | ✅ | ✅ | ✅ |

---

## 🗄️ Estructura de Base de Datos

### Tablas principales:

1. **usuarios** - Todos los usuarios del sistema
2. **areas** - Áreas de la fábrica (Tejido, Corte, etc.)
3. **trabajadores** - Información adicional de trabajadores
4. **actividades** - Tareas y órdenes de trabajo
5. **actividad_trabajador** - Asignaciones (N:M)
6. **actividad_comentarios** - Seguimiento
7. **actividad_adjuntos** - Archivos (opcional)

---

##  Usuarios de Prueba

La base de datos incluye usuarios de ejemplo:

| Usuario | Password | Rol | Email |
|---------|----------|-----|-------|
| admin | admin123 | admin | admin@fabricatextil.com |
| encargado_tejido | usuario123 | encargado | encargado.tejido@fabricatextil.com |
| encargado_corte | usuario123 | encargado | encargado.corte@fabricatextil.com |
| trabajador1 | usuario123 | trabajador | carlos.rodriguez@fabricatextil.com |
| trabajador2 | usuario123 | trabajador | ana.martinez@fabricatextil.com |

---

## 🐛 Troubleshooting

### Error: "ER_BAD_DB_ERROR"
La base de datos no existe. El servidor la creará automáticamente al iniciar.

### Error: "ER_ACCESS_DENIED_ERROR"
Credenciales incorrectas en `.env`. Verifica `DB_USER` y `DB_PASSWORD`.

### Error: "ECONNREFUSED"
MySQL no está corriendo. Inicia el servicio:
```bash
# Windows
net start MySQL80

# Linux/Mac
sudo service mysql start
```

### Error: "Port 5000 already in use"
Cambia el puerto en `.env`:
```env
PORT=5001
```

---

##  Notas importantes

1. **Tokens JWT**: Los access tokens expiran en 15 minutos. Usa el refresh token para obtener uno nuevo.

2. **Contraseñas**: Todas se almacenan encriptadas con bcrypt (10 rounds).

3. **CORS**: Por defecto permite todos los orígenes (`*`). En producción, especifica tu frontend en `FRONTEND_URL`.

4. **Rate Limiting**: Considera agregar `express-rate-limit` para proteger endpoints de login.

5. **HTTPS**: En producción, usa siempre HTTPS y actualiza los JWT secrets.


##  Autor

Valentino Palma Martorello - Proyecto Final

---

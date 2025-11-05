#  Sistema de Gestión de Actividades - Fábrica Textil

Sistema completo de administración de actividades para fábricas textiles con 3 roles de usuario: **Administrador**, **Encargado** y **Trabajador**.

---

##  Características Principales

###  Autenticación
- Login tradicional (usuario/contraseña)
- Autenticación con Google OAuth
- Tokens JWT con refresh automático
- Persistencia de sesión

###  Roles y Permisos

####  Administrador
- Gestión completa de usuarios (CRUD, roles, suspensión)
- Gestión de áreas de trabajo
- Aprobación/rechazo de solicitudes de encargados
- Visualización de todas las actividades
- Estadísticas generales del sistema

####  Encargado
- Creación de actividades en su área
- Asignación de trabajadores a actividades
- Edición de estado, progreso y prioridad
- Gestión de su equipo
- Estadísticas de su área

####  Trabajador
- Visualización de actividades asignadas
- Marcado de actividades completadas
- Comentarios en actividades
- Estadísticas personales

---

##  Stack Tecnológico

### Backend
- **Node.js** + **Express**
- **MySQL** (base de datos)
- **JWT** (autenticación)
- **bcrypt** (encriptación)
- **Passport.js** (OAuth Google)

### Frontend
- **React Native** (Expo)
- **TypeScript**
- **React Navigation** (navegación)
- **AsyncStorage** (persistencia)
- **Axios** (peticiones HTTP)
- **React Native Paper** (UI components)

---

##  Estructura del Proyecto

```
proyecto-textil/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── usuariosController.ts
│   │   │   ├── areasController.ts
│   │   │   └── actividadesController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── roles.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── usuarios.ts
│   │   │   ├── areas.ts
│   │   │   └── actividades.ts
│   │   ├── services/
│   │   │   └── tokenService.ts
│   │   └── index.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   ├── admin/
│   │   │   ├── supervisor/
│   │   │   ├── worker/
│   │   │   └── shared/
│   │   ├── navigation/
│   │   ├── context/
│   │   ├── services/
│   │   ├── types/
│   │   └── constants/
│   ├── App.tsx
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

##  Instalación y Configuración

### Requisitos Previos
- Node.js >= 16.x
- MySQL >= 8.x
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (para emulador) o dispositivo físico

---

###  Backend

#### Paso 1: Clonar repositorio
```bash
git clone <tu-repositorio>
cd proyecto-textil/backend
```

#### Paso 2: Instalar dependencias
```bash
npm install
```

#### Paso 3: Configurar variables de entorno
Crea un archivo `.env` basado en `.env.example`:

```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=fabrica_textil
DB_PORT=3306

# JWT
JWT_SECRET=tu_secreto_super_seguro_jwt
JWT_REFRESH_SECRET=tu_secreto_refresh_token
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Puerto
PORT=5000

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:19006
```

#### Paso 4: Crear base de datos
```bash
# Conectar a MySQL
mysql -u root -p

# Crear base de datos
CREATE DATABASE fabrica_textil CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

#### Paso 5: Iniciar servidor
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm start
```

El servidor estará en: `http://localhost:5000`

---

###  Frontend

#### Paso 1: Instalar dependencias
```bash
cd ../frontend
npm install
```

#### Paso 2: Configurar API URL
Edita `src/constants/index.ts`:

```typescript
export const API_URL = __DEV__ 
  ? 'http://TU_IP_LOCAL:5000/api'  // Cambiar por tu IP local
  : 'https://tu-backend-produccion.com/api';
```

**Importante:** Para probar en dispositivo físico:
1. Encuentra tu IP local: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
2. Reemplaza `localhost` por tu IP (ej: `192.168.1.10`)

#### Paso 3: Configurar Google OAuth (opcional)
Si usas Google Sign-In, configura en `src/constants/index.ts`:

```typescript
export const GOOGLE_CONFIG = {
  androidClientId: 'tu-android-client-id.apps.googleusercontent.com',
  webClientId: 'tu-web-client-id.apps.googleusercontent.com',
};
```

#### Paso 4: Iniciar aplicación
```bash
npm start
```

Opciones:
- Presiona `a` → Android emulator
- Presiona `i` → iOS simulator (solo Mac)
- Escanea QR con Expo Go app → dispositivo físico

---

##  Generar APK

### Opción 1: EAS Build (Recomendado)

```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Login en Expo
eas login

# 3. Configurar proyecto
eas build:configure

# 4. Construir APK
eas build -p android --profile preview
```

### Opción 2: APK Local (sin cuenta Expo)

```bash
# Crear APK local
expo build:android -t apk

# Descargar APK cuando termine
# El link aparecerá en la terminal
```

---

##  Base de Datos

### Tablas Principales

#### usuarios
```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255),
  email VARCHAR(100) UNIQUE NOT NULL,
  nombre_completo VARCHAR(100),
  telefono VARCHAR(20),
  foto_perfil VARCHAR(255),
  rol ENUM('admin', 'encargado', 'trabajador') DEFAULT 'trabajador',
  provider ENUM('local', 'google') DEFAULT 'local',
  estado_cuenta ENUM('activo', 'pendiente', 'rechazado', 'suspendido') DEFAULT 'activo',
  area_id INT,
  puesto VARCHAR(50),
  nivel_capacitacion ENUM('Básico', 'Intermedio', 'Avanzado'),
  fecha_ingreso DATE,
  activo BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (area_id) REFERENCES areas(id)
);
```

#### areas
```sql
CREATE TABLE areas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  responsable_id INT,
  activo BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (responsable_id) REFERENCES usuarios(id)
);
```

#### actividades
```sql
CREATE TABLE actividades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  area_id INT,
  encargado_id INT,
  creado_por INT,
  prioridad ENUM('Baja', 'Media', 'Alta') DEFAULT 'Media',
  estado ENUM('Pendiente', 'En Progreso', 'Finalizada', 'Bloqueada', 'Cancelada') DEFAULT 'Pendiente',
  fecha_inicio DATE,
  fecha_fin_estimada DATE,
  fecha_fin_real DATE,
  progreso_porcentaje INT DEFAULT 0,
  observaciones TEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (area_id) REFERENCES areas(id),
  FOREIGN KEY (encargado_id) REFERENCES usuarios(id),
  FOREIGN KEY (creado_por) REFERENCES usuarios(id)
);
```

---

##  API Endpoints

### Autenticación
```
POST   /api/auth/register              # Registrar usuario
POST   /api/auth/login                 # Login
POST   /api/auth/refresh               # Refresh token
POST   /api/auth/google                # OAuth Google
POST   /api/auth/google/callback       # Callback Google
```

### Usuarios
```
GET    /api/usuarios                   # Listar usuarios (admin)
GET    /api/usuarios/:id               # Obtener usuario
PUT    /api/usuarios/:id               # Actualizar usuario
PUT    /api/usuarios/:id/rol           # Cambiar rol (admin)
PUT    /api/usuarios/:id/estado        # Cambiar estado (admin)
DELETE /api/usuarios/:id               # Eliminar usuario (admin)
```

### Áreas
```
GET    /api/areas                      # Listar áreas
POST   /api/areas                      # Crear área (admin)
PUT    /api/areas/:id                  # Actualizar área (admin)
DELETE /api/areas/:id                  # Eliminar área (admin)
```

### Actividades
```
GET    /api/actividades                # Listar actividades
GET    /api/actividades/:id            # Obtener actividad
POST   /api/actividades                # Crear actividad (encargado/admin)
PUT    /api/actividades/:id            # Actualizar actividad
DELETE /api/actividades/:id            # Eliminar actividad (admin)
POST   /api/actividades/:id/asignar    # Asignar trabajadores
GET    /api/actividades/:id/comentarios # Listar comentarios
POST   /api/actividades/:id/comentarios # Crear comentario
```

---

##  Testing

### Backend
```bash
npm run test
```

### Frontend
```bash
npm run test
```

---

##  Usuarios de Prueba

### Administrador
```
Usuario: admin
Contraseña: admin123
```

### Encargado
```
Usuario: encargado1
Contraseña: encargado123
```

### Trabajador
```
Usuario: trabajador1
Contraseña: trabajador123
```

---

##  Seguridad

-  Passwords encriptados con bcrypt (salt rounds: 10)
-  Tokens JWT con expiración
-  Refresh tokens para renovación automática
-  Middleware de autenticación en todas las rutas protegidas
-  Control de acceso basado en roles (RBAC)
-  Validación de inputs con express-validator
-  Protección CORS
-  Helmet.js para headers seguros
-  Rate limiting para prevenir ataques

---

## Solución de Problemas

### Backend no inicia
```bash
# Verificar MySQL está corriendo
sudo systemctl status mysql

# Verificar credenciales en .env
cat .env

# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Frontend no conecta al backend
1. Verifica que el backend esté corriendo (`http://localhost:5000`)
2. Cambia `localhost` por tu IP local en `constants/index.ts`
3. Asegúrate de estar en la misma red WiFi
4. Desactiva firewall temporalmente

### Error al generar APK
```bash
# Limpiar caché de Expo
expo start -c

# Verificar configuración app.json
cat app.json

# Intentar con EAS Build
eas build -p android --profile preview
```

##  Autor

**Valentino Palma Martorello**
- GitHub: [@tuusuario](https://github.com/vepeeme)
- Email: palmamartorellovalentino@gmail.com


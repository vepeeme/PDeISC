// backend/src/index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import os from 'os';
import { conectarBD } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import areasRoutes from './routes/areas.routes.js';
import actividadesRoutes from './routes/actividades.routes.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PUERTO = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:19006',
  'http://localhost:8081',
  'http://192.168.1.*',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Permitir todos los orígenes en desarrollo
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // En producción, verificar origen
    if (allowedOrigins.some(allowed => origin.includes(allowed.replace('*', '')))) {
      callback(null, true);
    } else {
      console.log('⚠️ Origen bloqueado por CORS:', origin);
      callback(null, true); // Permitir de todos modos (cambiar a false para bloquear)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
}));

// ✅ Helmet con configuración ajustada para desarrollo
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Desactivar CSP en desarrollo
}));

// ✅ Rate limiting más permisivo en desarrollo
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 en dev, 100 en prod
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ✅ Logger mejorado
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`🔥 ${req.method} ${req.path} - ${timestamp} - Origin: ${req.get('origin') || 'N/A'}`);
  next();
});

// ✅ RUTAS DE LA API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/areas', areasRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/solicitudes', solicitudesRoutes);

// Ruta de salud - ✅ CON MÁS INFO
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    cors: 'enabled',
    database: 'connected'
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    mensaje: '🏭 API Fábrica Textil',
    version: '1.0.0',
    documentacion: '/api/health',
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      areas: '/api/areas',
      actividades: '/api/actividades',
      solicitudes: '/api/solicitudes'
    }
  });
});

// ✅ Manejo de rutas no encontradas CON MÁS INFO
app.use((req, res) => {
  console.log('❌ Ruta no encontrada:', req.method, req.path);
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// ✅ Manejo de errores global MEJORADO
app.use((err, req, res, next) => {
  console.error('❌ Error global:', err);
  console.error('Stack:', err.stack);
  
  // Error de autenticación
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      exito: false,
      mensaje: 'Token inválido o expirado'
    });
  }

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      exito: false,
      mensaje: 'Error de validación',
      detalles: err.details
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    exito: false,
    mensaje: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      tipo: err.name 
    })
  });
});

// ✅ INICIAR SERVIDOR
(async () => {
  try {
    // Conectar a la base de datos
    await conectarBD();
    
    const ipLocal = obtenerIPLocal();
    
    app.listen(PUERTO, '0.0.0.0', () => {
      console.log('\n' + '='.repeat(70));
      console.log('   🏭 SERVIDOR FÁBRICA TEXTIL');
      console.log('='.repeat(70));
      console.log(`🌐 Local:        http://localhost:${PUERTO}`);
      console.log(`🌐 Red:          http://${ipLocal}:${PUERTO}`);
      console.log(`🌐 Producción:   https://pdeisc-w8if.onrender.com`);
      console.log(`🌐 Env:          ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 CORS:         ${process.env.NODE_ENV === 'production' ? 'Restringido' : 'Abierto'}`);
      console.log('='.repeat(70));
      console.log('✅ Servidor iniciado correctamente');
      console.log('\n📋 Rutas disponibles:');
      console.log('   ❤️  GET  /api/health');
      console.log('   🔐 POST /api/auth/registro/trabajador');
      console.log('   🔐 POST /api/auth/registro/encargado');
      console.log('   🔐 POST /api/auth/login');
      console.log('   🔐 POST /api/auth/google/verify');
      console.log('   👥 GET  /api/usuarios');
      console.log('   🏢 GET  /api/areas');
      console.log('   📊 GET  /api/actividades/dashboard/stats');
      console.log('   📋 GET  /api/actividades');
      console.log('   📬 GET  /api/solicitudes');
      console.log('='.repeat(70) + '\n');
    });
  } catch (err) {
    console.error('\n❌ Error al iniciar servidor:', err);
    console.error('Stack:', err.stack);
    process.exit(1);
  }
})();

function obtenerIPLocal() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const iface = interfaces[interfaceName];
    if (iface) {
      for (const alias of iface) {
        if (alias.family === 'IPv4' && !alias.internal) {
          return alias.address;
        }
      }
    }
  }
  return 'localhost';
}

// ✅ Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT recibido, cerrando servidor...');
  process.exit(0);
});

// ✅ Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});
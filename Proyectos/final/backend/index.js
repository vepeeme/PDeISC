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


const app = express();
const PUERTO = process.env.PORT || 5000;

// Helmet para headers de seguridad
app.use(helmet());

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('⚠️ Origen bloqueado por CORS:', origin);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 200 : 500, // 500 en dev, 200 en prod
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde'
});
app.use('/api/', limiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logger simple
app.use((req, res, next) => {
  console.log(`🔥 ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
  next();
});
// 📍 RUTAS DE LA API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/areas', areasRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/solicitudes', solicitudesRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    mensaje: '🏭 API Fábrica Textil',
    version: '1.0.0',
    documentacion: '/api/health'
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    exito: false,
    mensaje: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
// INICIAR SERVIDOR
(async () => {
  try {
    await conectarBD();
    const ipLocal = obtenerIPLocal();
    
    app.listen(PUERTO, '0.0.0.0', () => {
      console.log('\n' + '='.repeat(60));
      console.log('   🏭 SERVIDOR FÁBRICA TEXTIL');
      console.log('='.repeat(60));
      console.log(`🌍 Local:   http://localhost:${PUERTO}`);
      console.log(`🌍 Red:     http://${ipLocal}:${PUERTO}`);
      console.log(`🌍 Env:     ${process.env.NODE_ENV || 'development'}`);
      console.log('='.repeat(60) + '\n');
      console.log('✅ Servidor iniciado correctamente');
      console.log('📋 Rutas disponibles:');
      console.log('   - GET  /api/health');
      console.log('   - POST /api/auth/registro/trabajador');
      console.log('   - POST /api/auth/registro/encargado');
      console.log('   - POST /api/auth/login');
      console.log('   - POST /api/auth/google/verify');
      console.log('   - GET  /api/usuarios');
      console.log('   - GET  /api/areas');
      console.log('   - GET  /api/actividades');
      console.log('   - GET  /api/solicitudes (admin)');
      console.log('');
    });
  } catch (err) {
    console.error('\n❌ Error al iniciar servidor:', err);
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
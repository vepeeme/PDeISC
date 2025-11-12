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
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:19006',
  'http://localhost:8081',
  'http://localhost:3000',
  'https://tu-app.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origin (Postman, apps móviles)
    if (!origin) return callback(null, true);
    
    // En desarrollo, permitir localhost
    if (!IS_PRODUCTION || origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // En producción, verificar lista de orígenes
    const isAllowed = allowedOrigins.some(allowed => 
      origin === allowed || origin.includes(allowed?.replace('*', ''))
    );
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('⚠️ Origen bloqueado:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: IS_PRODUCTION ? undefined : false
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: IS_PRODUCTION ? 200 : 1000,
  message: {
    exito: false,
    mensaje: 'Demasiadas peticiones. Intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path === '/api/health' || req.path === '/health';
  }
});

app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`🔥 ${req.method} ${req.path} - ${timestamp} - IP: ${ip} - Origin: ${req.get('origin') || 'N/A'}`);
  next();
});

// ===== RUTAS DE LA API =====
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/areas', areasRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/solicitudes', solicitudesRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    cors: 'enabled',
    database: 'connected',
    trustProxy: app.get('trust proxy')
  });
});

app.get('/', (req, res) => {
  res.json({
    mensaje: '🏭 API Fábrica Textil',
    version: '1.0.0',
    status: 'online',
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

app.use((req, res) => {
  console.log('❌ Ruta no encontrada:', req.method, req.path);
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada',
    path: req.path,
    method: req.method,
    sugerencia: 'Verifica la URL y el método HTTP'
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Error global:', err.message);
  console.error('Stack:', err.stack);
  
  if (err.code === 'ERR_ERL_UNEXPECTED_X_FORWARDED_FOR') {
    console.error('⚠️ Error de Rate Limit - trust proxy configurado:', app.get('trust proxy'));
    return res.status(500).json({
      exito: false,
      mensaje: 'Error de configuración del servidor'
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      exito: false,
      mensaje: 'Token inválido o expirado'
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      exito: false,
      mensaje: 'Error de validación',
      detalles: err.details
    });
  }

  res.status(err.status || 500).json({
    exito: false,
    mensaje: err.message || 'Error interno del servidor',
    ...(IS_PRODUCTION ? {} : { 
      stack: err.stack,
      tipo: err.name 
    })
  });
});

(async () => {
  try {
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
      console.log(`🔒 CORS:         ${IS_PRODUCTION ? 'Restringido' : 'Abierto'}`);
      console.log(`🔐 Trust Proxy:  ${app.get('trust proxy')}`);
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

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido, cerrando servidor gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT recibido, cerrando servidor gracefully...');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection en:', promise);
  console.error('Razón:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});
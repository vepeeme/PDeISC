// backend/middleware/auth.js 
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware para verificar token JWT
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      exito: false,
      mensaje: 'Token no proporcionado'
    });
  }

  const token = authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      exito: false,
      mensaje: 'Token no proporcionado'
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_change_me');
    
    // Agregar información del usuario al request
    req.user = {
      id: payload.id,
      rol: payload.rol,
      usuario: payload.usuario
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      exito: false,
      mensaje: 'Token inválido'
    });
  }
}

// Middleware para verificar roles específicos
export function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Usuario no autenticado'
      });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No tienes permisos para realizar esta acción',
        rol_requerido: rolesPermitidos,
        tu_rol: req.user.rol
      });
    }

    next();
  };
}

// Middleware opcional: verificar que el usuario solo pueda acceder a sus propios recursos
export function checkOwnership(req, res, next) {
  const userId = parseInt(req.params.id);
  
  // Admin puede acceder a todo
  if (req.user.rol === 'admin') {
    return next();
  }

  // El usuario solo puede acceder a sus propios datos
  if (req.user.id !== userId) {
    return res.status(403).json({
      exito: false,
      mensaje: 'No puedes acceder a recursos de otros usuarios'
    });
  }

  next();
}

export default {
  authMiddleware,
  requireRole,
  checkOwnership
};
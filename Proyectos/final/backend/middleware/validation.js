// backend/src/middleware/validation.js
import Joi from 'joi';
import { PUESTOS_DISPONIBLES } from '../constants/puestos.js';
// Middleware genérico de validación
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errores = error.details.map(detail => detail.message);
      return res.status(400).json({
        exito: false,
        mensaje: 'Errores de validación',
        errores
      });
    }

    next();
  };
};
// SCHEMAS DE VALIDACIÓN - AUTH
export const registroTrabajadorSchema = Joi.object({
  usuario: Joi.string().min(3).max(50).required()
    .messages({
      'string.min': 'El usuario debe tener al menos 3 caracteres',
      'string.max': 'El usuario no puede exceder 50 caracteres',
      'any.required': 'El usuario es obligatorio'
    }),
  password: Joi.string().min(6).required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es obligatoria'
    }),
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es obligatorio'
    }),
  nombre_completo: Joi.string()
    .max(255)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'El nombre solo puede contener letras y espacios',
      'string.max': 'El nombre no puede exceder 255 caracteres'
    }),
  telefono: Joi.string()
    .max(20)
    .pattern(/^[0-9+\-\s()]*$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'El teléfono solo puede contener números',
      'string.max': 'El teléfono no puede exceder 20 caracteres'
    }),
  area_id: Joi.number().integer().positive().allow(null),
  puesto: Joi.string()
    .valid(...PUESTOS_DISPONIBLES)
    .allow(null, '')
    .messages({
      'any.only': `El puesto debe ser uno de los siguientes: ${PUESTOS_DISPONIBLES.join(', ')}`
    })
});

export const registroEncargadoSchema = Joi.object({
  usuario: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  nombre_completo: Joi.string()
    .max(255)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'El nombre solo puede contener letras y espacios',
      'string.max': 'El nombre no puede exceder 255 caracteres'
    }),
  telefono: Joi.string()
    .max(20)
    .pattern(/^[0-9+\-\s()]*$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'El teléfono solo puede contener números'
    }),
  area_id: Joi.number().integer().positive().allow(null),
  motivo: Joi.string().max(500).allow(null, '')
});

export const loginSchema = Joi.object({
  usuario: Joi.string().required()
    .messages({
      'any.required': 'El usuario es obligatorio'
    }),
  password: Joi.string().required()
    .messages({
      'any.required': 'La contraseña es obligatoria'
    })
});

export const googleAuthSchema = Joi.object({
  idToken: Joi.string().allow(null, ''),
  email: Joi.string().email().required(),
  nombre: Joi.string().required(),
  foto: Joi.string().allow(null, '')
});

export const googleCompletarSchema = Joi.object({
  email: Joi.string().email().required(),
  nombre: Joi.string().required(),
  foto: Joi.string().allow(null, ''),
  rol: Joi.string().valid('trabajador', 'encargado').required(),
  area_id: Joi.number().integer().positive().allow(null),
  puesto: Joi.string().max(100).allow(null, ''),
  motivo: Joi.string().max(500).allow(null, '')
});

// SCHEMAS DE VALIDACIÓN - USUARIOS
export const actualizarUsuarioSchema = Joi.object({
  nombre_completo: Joi.string()
    .min(3)
    .max(255)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'El nombre solo puede contener letras y espacios',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder 255 caracteres'
    }),
  telefono: Joi.string()
    .max(20)
    .pattern(/^[0-9+\-\s()]*$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'El teléfono solo puede contener números',
      'string.max': 'El teléfono no puede exceder 20 caracteres'
    }),
  foto_perfil: Joi.string().allow(null, '')
});
// SCHEMAS DE VALIDACIÓN - ÁREAS
export const crearAreaSchema = Joi.object({
  nombre: Joi.string().min(3).max(150).required()
    .messages({
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder 150 caracteres',
      'any.required': 'El nombre es obligatorio'
    }),
  descripcion: Joi.string().allow(null, ''),
  responsable_id: Joi.number().integer().positive().allow(null)
});

export const actualizarAreaSchema = Joi.object({
  nombre: Joi.string().min(3).max(150).required(),
  descripcion: Joi.string().allow(null, ''),
  responsable_id: Joi.number().integer().positive().allow(null)
});

// SCHEMAS DE VALIDACIÓN - ACTIVIDADES
export const crearActividadSchema = Joi.object({
  titulo: Joi.string().min(3).max(200).required()
    .messages({
      'string.min': 'El título debe tener al menos 3 caracteres',
      'string.max': 'El título no puede exceder 200 caracteres',
      'any.required': 'El título es obligatorio'
    }),
  descripcion: Joi.string().allow(null, ''),
  area_id: Joi.number().integer().positive().required()
    .messages({
      'any.required': 'El área es obligatoria'
    }),
  encargado_id: Joi.number().integer().positive().allow(null),
  prioridad: Joi.string().valid('Baja', 'Media', 'Alta').default('Media'),
  fecha_inicio: Joi.date().iso().allow(null),
  fecha_fin_estimada: Joi.date().iso().allow(null)
});

export const actualizarActividadSchema = Joi.object({
  titulo: Joi.string().min(3).max(200),
  descripcion: Joi.string().allow(null, ''),
  prioridad: Joi.string().valid('Baja', 'Media', 'Alta'),
  estado: Joi.string().valid('Pendiente', 'En Progreso', 'Finalizada', 'Bloqueada', 'Cancelada'),
  fecha_inicio: Joi.date().iso().allow(null),
  fecha_fin_estimada: Joi.date().iso().allow(null),
  fecha_fin_real: Joi.date().iso().allow(null),
  progreso_porcentaje: Joi.number().integer().min(0).max(100)
});

export const asignarTrabajadoresSchema = Joi.object({
  trabajadores: Joi.array().items(
    Joi.object({
      trabajador_id: Joi.number().integer().positive().required(),
      rol_en_actividad: Joi.string().max(100).default('Operario')
    })
  ).required()
    .messages({
      'any.required': 'Se requiere un array de trabajadores'
    })
});

export const agregarComentarioSchema = Joi.object({
  mensaje: Joi.string().min(1).max(1000).required()
    .messages({
      'string.min': 'El mensaje no puede estar vacío',
      'string.max': 'El mensaje no puede exceder 1000 caracteres',
      'any.required': 'El mensaje es obligatorio'
    })
});

// SCHEMAS DE VALIDACIÓN - SOLICITUDES
export const aprobarSolicitudSchema = Joi.object({
  area_id: Joi.number().integer().positive().allow(null),
  comentario: Joi.string().max(500).allow(null, '')
});

export const rechazarSolicitudSchema = Joi.object({
  comentario: Joi.string().max(500).allow(null, '')
});

export default {
  validate,
  registroTrabajadorSchema,
  registroEncargadoSchema,
  loginSchema,
  googleAuthSchema,
  googleCompletarSchema,
  actualizarUsuarioSchema,
  crearAreaSchema,
  actualizarAreaSchema,
  crearActividadSchema,
  actualizarActividadSchema,
  asignarTrabajadoresSchema,
  agregarComentarioSchema,
  aprobarSolicitudSchema,
  rechazarSolicitudSchema
};
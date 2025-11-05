// src/types/index.ts
export type Rol = 'admin' | 'encargado' | 'trabajador';

export type EstadoCuenta = 'activo' | 'pendiente' | 'rechazado' | 'suspendido';

export type Provider = 'local' | 'google';

export interface Usuario {
  id: number;
  usuario: string;
  email: string;
  nombre_completo?: string;
  telefono?: string;
  foto_perfil?: string;
  rol: Rol;
  provider: Provider;
  estado_cuenta: EstadoCuenta;
  activo: boolean;
  creado_en: string;
  
  // Datos de trabajador si aplica
  area_id?: number;
  area_nombre?: string;
  puesto?: string;
  nivel_capacitacion?: 'Básico' | 'Intermedio' | 'Avanzado';
  fecha_ingreso?: string;
}

export interface Area {
  id: number;
  nombre: string;
  descripcion?: string;
  responsable_id?: number;
  responsable_nombre?: string;
  responsable_email?: string;
  responsable_foto?: string;
  activo: boolean;
  total_trabajadores?: number;
  total_actividades?: number;
  creado_en: string;
}

export type EstadoActividad = 'Pendiente' | 'En Progreso' | 'Finalizada' | 'Bloqueada' | 'Cancelada';
export type PrioridadActividad = 'Baja' | 'Media' | 'Alta';

export interface Actividad {
  id: number;
  titulo: string;
  descripcion?: string;
  area_id?: number;
  area_nombre?: string;
  encargado_id?: number;
  encargado_nombre?: string;
  creado_por?: number;
  creado_por_nombre?: string;
  prioridad: PrioridadActividad;
  estado: EstadoActividad;
  fecha_inicio?: string;
  fecha_fin_estimada?: string;
  fecha_fin_real?: string;
  progreso_porcentaje: number;
  observaciones?: string;
  total_trabajadores?: number;
  trabajadores?: TrabajadorAsignado[];
  comentarios?: Comentario[];
  creado_en: string;
  actualizado_en: string;
}

export interface TrabajadorAsignado {
  id: number;
  nombre_completo: string;
  email: string;
  foto_perfil?: string;
  rol_en_actividad: string;
  asignado_en: string;
}

export interface Comentario {
  id: number;
  actividad_id: number;
  usuario_id: number;
  usuario_nombre: string;
  usuario_foto?: string;
  usuario_rol: Rol;
  mensaje: string;
  creado_en: string;
}

export interface Solicitud {
  id: number;
  usuario_id: number;
  usuario: string;
  email: string;
  nombre_completo?: string;
  telefono?: string;
  foto_perfil?: string;
  area_solicitada_id?: number;
  area_solicitada_nombre?: string;
  motivo?: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  revisado_por?: number;
  revisado_por_nombre?: string;
  comentario_revision?: string;
  creado_en: string;
  revisado_en?: string;
}

export interface AuthResponse {
  exito: boolean;
  mensaje: string;
  accessToken?: string;
  refreshToken?: string;
  usuario?: Usuario;
  necesita_completar?: boolean;
  datos_google?: {
    email: string;
    nombre: string;
    foto?: string;
  };
}

export interface ApiResponse<T = any> {
  exito: boolean;
  mensaje?: string;
  data?: T;
  total?: number;
  error?: string;
}

export interface DashboardStats {
  totalUsuarios?: number;
  totalAreas?: number;
  totalActividades?: number;
  misActividades?: number;
  trabajadoresEnMiArea?: number;
  actividadesPorEstado: Array<{
    estado: EstadoActividad;
    cantidad: number;
  }>;
}

// Tipos para formularios
export interface RegistroTrabajadorForm {
  usuario: string;
  password: string;
  email: string;
  nombre_completo?: string;
  telefono?: string;
  area_id?: number;
  puesto?: string;
}

export interface RegistroEncargadoForm extends RegistroTrabajadorForm {
  motivo?: string;
}

export interface LoginForm {
  usuario: string;
  password: string;
}

export interface CompletarGoogleForm {
  email: string;
  nombre: string;
  foto?: string;
  rol: 'trabajador' | 'encargado';
  area_id?: number;
  puesto?: string;
  motivo?: string;
}

export interface CrearActividadForm {
  titulo: string;
  descripcion?: string;
  area_id: number;
  encargado_id?: number;
  prioridad: PrioridadActividad;
  fecha_inicio?: string;
  fecha_fin_estimada?: string;
}

export interface ActualizarActividadForm {
  titulo?: string;
  descripcion?: string;
  prioridad?: PrioridadActividad;
  estado?: EstadoActividad;
  fecha_inicio?: string;
  fecha_fin_estimada?: string;
  fecha_fin_real?: string;
  progreso_porcentaje?: number;
}
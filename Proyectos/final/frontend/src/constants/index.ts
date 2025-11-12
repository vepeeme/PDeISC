export const API_URL = 'https://pdeisc-w8if.onrender.com/api';
console.log('🔧 API URL configurada:', API_URL);
console.log('🔧 Usando servidor de producción en Render');

export const GOOGLE_CONFIG = {
  androidClientId: '581190540985-0pn14iice9bupd1pducvcj1g5v05alsa.apps.googleusercontent.com',
  webClientId: '581190540985-ebbec109kp47ti4us12nvrvvgu5d70cj.apps.googleusercontent.com',
  expoClientId: '581190540985-ebbec109kp47ti4us12nvrvvgu5d70cj.apps.googleusercontent.com',
  redirectUri: 'https://auth.expo.io/@vepeeme0/frontend',
  scheme: 'com.vepeeme0.frontend',
};

export const Colors = {
  primary: '#3b82f6',  
  secondary: '#8b5cf6', 
  success: '#10b981',  
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  
  dark: '#1f2937',
  gray: '#6b7280',
  lightGray: '#d1d5db',
  border: '#e5e7eb',
  background: '#f9fafb',
  white: '#ffffff',
  
  pendiente: '#f59e0b',
  enProgreso: '#3b82f6',
  finalizada: '#10b981',
  bloqueada: '#ef4444',
  cancelada: '#6b7280',
};

export const ESTADOS_ACTIVIDAD = [
  { value: 'Pendiente', label: 'Pendiente', color: Colors.pendiente },
  { value: 'En Progreso', label: 'En Progreso', color: Colors.enProgreso },
  { value: 'Finalizada', label: 'Finalizada', color: Colors.finalizada },
  { value: 'Bloqueada', label: 'Bloqueada', color: Colors.bloqueada },
  { value: 'Cancelada', label: 'Cancelada', color: Colors.cancelada },
];

export const PRIORIDADES = [
  { value: 'Baja', label: 'Baja', color: Colors.success },
  { value: 'Media', label: 'Media', color: Colors.warning },
  { value: 'Alta', label: 'Alta', color: Colors.danger },
];

export const NIVELES_CAPACITACION = [
  { value: 'Básico', label: 'Básico' },
  { value: 'Intermedio', label: 'Intermedio' },
  { value: 'Avanzado', label: 'Avanzado' },
];

export const ROLES = {
  ADMIN: 'admin',
  ENCARGADO: 'encargado',
  TRABAJADOR: 'trabajador',
};

export const ROLES_LABELS = {
  admin: 'Administrador',
  encargado: 'Encargado',
  trabajador: 'Trabajador',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@fabrica_access_token',
  REFRESH_TOKEN: '@fabrica_refresh_token',
  USER_DATA: '@fabrica_user_data',
  REMEMBER_ME: '@fabrica_remember_me',
};

export const ROUTES = {
  // Auth
  LOGIN: 'Login',
  REGISTER_WORKER: 'RegisterWorker',
  REGISTER_SUPERVISOR: 'RegisterSupervisor',
  COMPLETE_GOOGLE_REGISTER: 'CompleteGoogleRegister',
  
  ADMIN_DASHBOARD: 'AdminDashboard',
  ADMIN_USERS: 'AdminUsers',
  ADMIN_AREAS: 'AdminAreas',
  ADMIN_ACTIVITIES: 'AdminActivities',
  ADMIN_REQUESTS: 'AdminRequests',
  
  SUPERVISOR_DASHBOARD: 'SupervisorDashboard',
  SUPERVISOR_ACTIVITIES: 'SupervisorActivities',
  CREATE_ACTIVITY: 'CreateActivity',
  EDIT_ACTIVITY: 'EditActivity',
  ASSIGN_WORKERS: 'AssignWorkers',
  
  WORKER_DASHBOARD: 'WorkerDashboard',
  WORKER_ACTIVITIES: 'WorkerActivities',
  
  ACTIVITY_DETAIL: 'ActivityDetail',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
};

export const MESSAGES = {
  LOADING: 'Cargando...',
  ERROR_NETWORK: 'Error de conexión. Verifica tu internet.',
  ERROR_GENERIC: 'Ocurrió un error. Intenta nuevamente.',
  SUCCESS_LOGIN: 'Inicio de sesión exitoso',
  SUCCESS_REGISTER: 'Registro exitoso',
  SUCCESS_UPDATE: 'Actualización exitosa',
  SUCCESS_DELETE: 'Eliminado exitosamente',
  PENDING_APPROVAL: 'Tu solicitud está pendiente de aprobación',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
};

export const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=Usuario&background=3b82f6&color=fff';

export const TIMEOUTS = {
  API_REQUEST: 30000, 
  TOAST_DURATION: 3000, 
  DEBOUNCE_SEARCH: 500, 
};

export const PAGINATION = {
  ITEMS_PER_PAGE: 20,
  INITIAL_PAGE: 1,
};

export const SIZES = {
  AVATAR_SMALL: 40,
  AVATAR_MEDIUM: 60,
  AVATAR_LARGE: 100,
  ICON_SMALL: 20,
  ICON_MEDIUM: 24,
  ICON_LARGE: 32,
  BORDER_RADIUS: 8,
  SPACING: 16,
};
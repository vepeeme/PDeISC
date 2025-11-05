// src/services/data.service.ts
import { apiService } from './api.service';
import {
  Usuario,
  Area,
  Actividad,
  Solicitud,
  DashboardStats,
  CrearActividadForm,
  ActualizarActividadForm,
  ApiResponse,
} from '@/types';

//  DASHBOARD
export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await apiService.get<{ exito: boolean; stats: DashboardStats }>(
      '/actividades/dashboard/stats'
    );
    return response.stats;
  },
};

//  USUARIOS
export const usuariosService = {
  async getAll(params?: { rol?: string; estado_cuenta?: string; area_id?: number }) {
    const queryString = new URLSearchParams(params as any).toString();
    const response = await apiService.get<{ exito: boolean; total: number; usuarios: Usuario[] }>(
      `/usuarios${queryString ? `?${queryString}` : ''}`
    );
    return response;
  },

  async getById(id: number) {
    const response = await apiService.get<{ exito: boolean; usuario: Usuario }>(`/usuarios/${id}`);
    return response.usuario;
  },

  async update(id: number, data: Partial<Usuario>) {
    const response = await apiService.put<ApiResponse>(`/usuarios/${id}`, data);
    return response;
  },

  async updateRol(id: number, rol: string) {
    const response = await apiService.put<ApiResponse>(`/usuarios/${id}/rol`, { rol });
    return response;
  },

  async updateEstado(id: number, estado_cuenta: string) {
    const response = await apiService.put<ApiResponse>(`/usuarios/${id}/estado`, { estado_cuenta });
    return response;
  },

  async delete(id: number) {
    const response = await apiService.delete<ApiResponse>(`/usuarios/${id}`);
    return response;
  },

  async getTrabajadoresPorArea(areaId: number) {
    const response = await apiService.get<{ exito: boolean; total: number; trabajadores: Usuario[] }>(
      `/usuarios/area/${areaId}/trabajadores`
    );
    return response.trabajadores;
  },
};

// ÁREAS
export const areasService = {
  async getAll() {
    const response = await apiService.get<{ exito: boolean; total: number; areas: Area[] }>('/areas');
    return response.areas;
  },

  async getPublicas() {
    const response = await apiService.get<{ exito: boolean; total: number; areas: Area[] }>(
      '/areas/publicas'
    );
    return response.areas;
  },

  async getById(id: number) {
    const response = await apiService.get<{ exito: boolean; area: Area }>(`/areas/${id}`);
    return response.area;
  },

  async create(data: { nombre: string; descripcion?: string; responsable_id?: number }) {
    const response = await apiService.post<ApiResponse>('/areas', data);
    return response;
  },

  async update(id: number, data: { nombre: string; descripcion?: string; responsable_id?: number }) {
    const response = await apiService.put<ApiResponse>(`/areas/${id}`, data);
    return response;
  },

  async delete(id: number) {
    const response = await apiService.delete<ApiResponse>(`/areas/${id}`);
    return response;
  },

  async getStats(id: number) {
    const response = await apiService.get<{ exito: boolean; estadisticas: any }>(`/areas/${id}/stats`);
    return response.estadisticas;
  },
};

//  ACTIVIDADES
export const actividadesService = {
  async getAll(params?: {
    area_id?: number;
    estado?: string;
    prioridad?: string;
    encargado_id?: number;
  }) {
    const queryString = new URLSearchParams(params as any).toString();
    const response = await apiService.get<{ exito: boolean; total: number; actividades: Actividad[] }>(
      `/actividades${queryString ? `?${queryString}` : ''}`
    );
    return response;
  },

  async getById(id: number) {
    const response = await apiService.get<{ exito: boolean; actividad: Actividad }>(
      `/actividades/${id}`
    );
    return response.actividad;
  },

  async create(data: CrearActividadForm) {
    const response = await apiService.post<ApiResponse>('/actividades', data);
    return response;
  },

  async update(id: number, data: ActualizarActividadForm) {
    const response = await apiService.put<ApiResponse>(`/actividades/${id}`, data);
    return response;
  },

  async delete(id: number) {
    const response = await apiService.delete<ApiResponse>(`/actividades/${id}`);
    return response;
  },

  async asignarTrabajadores(
    id: number,
    trabajadores: Array<{ trabajador_id: number; rol_en_actividad?: string }>
  ) {
    const response = await apiService.post<ApiResponse>(`/actividades/${id}/asignar`, {
      trabajadores,
    });
    return response;
  },

  async getComentarios(id: number) {
    const response = await apiService.get<{ exito: boolean; total: number; comentarios: any[] }>(
      `/actividades/${id}/comentarios`
    );
    return response.comentarios;
  },

  async agregarComentario(id: number, mensaje: string) {
    const response = await apiService.post<ApiResponse>(`/actividades/${id}/comentarios`, {
      mensaje,
    });
    return response;
  },

  // Método específico para trabajadores
  async completarActividad(id: number) {
    const response = await apiService.put<ApiResponse>(`/actividades/${id}/completar`);
    return response;
  },
};

//  SOLICITUDES (solo admin)
export const solicitudesService = {
  async getAll(estado?: 'pendiente' | 'aprobada' | 'rechazada') {
    const queryString = estado ? `?estado=${estado}` : '';
    const response = await apiService.get<{ exito: boolean; total: number; solicitudes: Solicitud[] }>(
      `/solicitudes${queryString}`
    );
    return response;
  },

  async aprobar(id: number, data?: { area_id?: number; comentario?: string }) {
    const response = await apiService.put<ApiResponse>(`/solicitudes/${id}/aprobar`, data);
    return response;
  },

  async rechazar(id: number, comentario?: string) {
    const response = await apiService.put<ApiResponse>(`/solicitudes/${id}/rechazar`, {
      comentario,
    });
    return response;
  },

  async delete(id: number) {
    const response = await apiService.delete<ApiResponse>(`/solicitudes/${id}`);
    return response;
  },
};
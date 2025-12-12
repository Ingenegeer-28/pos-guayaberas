// src/app/core/models/user.model.ts

export interface User {
  id_usuario?: number; // Opcional para creación
  username: string;
  nombre: string;
  rol: string; // Ej: 'admin', 'empleado'
  estatus: number; // 1=Activo, 0=Inactivo
  fecha_creacion?: string; 
  password?: string; // Solo necesario en POST/PUT
}

// Estructura de la respuesta del backend PHP
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error_details?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id_usuario: number;
    nombre: string;
    rol: string;
  };
}
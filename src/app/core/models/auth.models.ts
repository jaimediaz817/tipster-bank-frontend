export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * Respuesta del backend al hacer login
 * (ajusta nombres si tu backend devuelve algo distinto).
 */
export interface AuthResponse {
  accessToken: string;
  tokenType: string; // normalmente "Bearer"
  userId: number;
  email: string;
  fullName: string;
  roles: string[]; // ["ROLE_CLIENTE", "ROLE_ANALISTA", ...]
}

/**
 * Usuario autenticado en el frontend
 * (modelo "limpio" para la app).
 */
export interface CurrentUser {
  id: number;
  email: string;
  fullName: string;
  roles: string[];
  avatarUrl?: string;
}

/**
 * Roles que vas a usar en guards / vistas.
 */
export enum UserRole {
  CLIENTE = 'ROLE_CLIENTE',
  ANALISTA = 'ROLE_ANALISTA',
  ADMIN = 'ROLE_ADMIN',
}

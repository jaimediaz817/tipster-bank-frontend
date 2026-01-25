import { Injectable, computed, signal } from '@angular/core';
import { CurrentUser, AuthResponse } from '../models/auth.models';

const STORAGE_KEY = 'credit_platform_auth';

interface AuthState {
  token: string | null;
  currentUser: CurrentUser | null;
}

/**
 * Store de autenticación basado en Signals.
 *
 * - Mantiene el estado en memory.
 * - Lo sincroniza con localStorage para persistencia.
 * - Expone signals y helpers que usan los guards, interceptores y componentes.
 * 
 * 
 Concepto para entrevista:
Signals dan estado reactivo integrado en Angular (sin boilerplate de NgRx).
Para auth (token, usuario, flags de loading) es perfecto porque:
Es poca información,
Muy compartida en toda la app,
Necesitamos reactividad inmediata (ej. mostrar/ocultar items del menú).
 * 
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _state = signal<AuthState>({
    token: null,
    currentUser: null,
  });

  // Signals "derivadas"
  readonly token = computed(() => this._state().token);
  readonly currentUser = computed(() => this._state().currentUser);
  readonly isAuthenticated = computed(() => !!this._state().token);

  constructor() {
    this.restoreFromStorage();
  }

  /**
   * Llamar cuando el backend devuelve un AuthResponse exitoso (login).
   */
  setAuth(response: AuthResponse): void {
    const currentUser: CurrentUser = {
      id: response.userId,
      email: response.email,
      fullName: response.fullName,
      roles: response.roles,
    };

    this._state.set({
      token: response.accessToken,
      currentUser,
    });

    this.saveToStorage();
  }

  logout(): void {
    this._state.set({
      token: null,
      currentUser: null,
    });
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Comprueba si el usuario tiene al menos uno de los roles requeridos.
   */
  hasAnyRole(requiredRoles: string[]): boolean {
    const user = this.currentUser();
    if (!user) return false;

    return requiredRoles.some((role) => user.roles.includes(role));
  }

  // ────────────────────────────────────────────────────────────────
  // Persistencia en localStorage
  // ────────────────────────────────────────────────────────────────

  private saveToStorage(): void {
    const state = this._state();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: state.token,
        currentUser: state.currentUser,
      }),
    );
  }

  private restoreFromStorage(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as AuthState;
      this._state.set(parsed);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

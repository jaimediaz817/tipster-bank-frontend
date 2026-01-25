import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { AuthStore } from '../state/auth.store';

/**
 * Espera que en la ruta haya data: { roles: ['ROLE_ANALISTA', 'ROLE_ADMIN'] }
 */
export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): boolean | UrlTree => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (!requiredRoles || requiredRoles.length === 0) {
    // Si no se especifican roles, dejamos pasar al autenticado
    return authStore.isAuthenticated() ? true : router.parseUrl('/auth/login');
  }

  if (!authStore.isAuthenticated()) {
    return router.parseUrl('/auth/login');
  }

  const hasRole = authStore.hasAnyRole(requiredRoles);

  if (!hasRole) {
    // Podríamos redirigir a una página "403" custom
    return router.parseUrl('/dashboard');
  }

  return true;
};

// import { UserRole } from './auth.models';

import { UserRole } from "../../models/auth.models";

// import { UserRole } from "../../models/auth.models";

/**
 * Representa un único enlace de navegación.
 */
export interface NavigationLink {
  label: string;
  routerLink: string;
  icon?: string;
  roles?: UserRole[]; // Quién puede ver este enlace específico
}

/**
 * Representa un grupo de enlaces en el submenú.
 */
export interface NavigationGroup {
  title: string;
  links: NavigationLink[];
}

/**
 * Representa un item principal del sidebar.
 */
export interface NavigationItem {
  label: string;
  icon: string;
  roles: UserRole[];    // <-- ¡CLAVE! Define qué roles ven este item.
  isMenu?: boolean;
  routerLink?: string;
  groups?: NavigationGroup[];
}
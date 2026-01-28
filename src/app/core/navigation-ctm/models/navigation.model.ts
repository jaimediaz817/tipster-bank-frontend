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



// --------------------------------------
// V2
// --------------------------------------
// Define la estructura de los enlaces y grupos para claridad
export interface NavLink {
  label: string;
  routerLink: string;
  icon: string; // Icono de Material Symbols (ej: 'add_circle')
  isNew?: boolean; // Etiqueta opcional "Nuevo"
  children?: NavLink[]; // <-- hijos navegables
}

export interface NavGroup {
  id: string; // Identificador único para el grupo
  label: string;
  icon: string; // Icono para el botón principal del sidebar
  roles: UserRole[];
  links: NavLink[];
}
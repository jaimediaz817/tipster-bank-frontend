import { Injectable, signal } from '@angular/core';
import { Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Breadcrumb } from '../models/breadcrumb.model';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly _breadcrumbs = signal<Breadcrumb[]>([]);
  readonly breadcrumbs = this._breadcrumbs.asReadonly();

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const root = this.router.routerState.snapshot.root;
        const breadcrumbs: Breadcrumb[] = [];
        this.addBreadcrumb(root, '', breadcrumbs);
        this._breadcrumbs.set(breadcrumbs);
      });
  }

  private addBreadcrumb(
    route: ActivatedRouteSnapshot | null,
    parentUrl: string,
    breadcrumbs: Breadcrumb[]
  ) {
    if (!route) {
      return;
    }

    // Construye la URL de la ruta actual
    const routeUrl = `${parentUrl}/${route.url.map((segment) => segment.path).join('/')}`;

    // Si la ruta tiene un 'breadcrumb' definido en su 'data', lo añadimos
    if (route.data['breadcrumb']) {
      const breadcrumb: Breadcrumb = {
        label: route.data['breadcrumb'],
        url: routeUrl,
      };
      breadcrumbs.push(breadcrumb);
    }

    // Llamada recursiva para el siguiente nivel de anidación
    this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
  }
}
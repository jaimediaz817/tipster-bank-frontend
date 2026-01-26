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
        if (!route) return;

        const segment = route.url.map((s) => s.path).filter(Boolean).join('/');
        // Normaliza la URL acumulada
        const routeUrl = parentUrl
            ? segment
            ? `${parentUrl}/${segment}`
            : parentUrl
            : segment
            ? `/${segment}`
            : '/';

        // Si hay etiqueta de breadcrumb, añadimos
        const label = route.data?.['breadcrumb'];
        if (label) {
            breadcrumbs.push({ label, url: routeUrl });
        }

        // Avanza al primer hijo (outlet primario)
        this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
}
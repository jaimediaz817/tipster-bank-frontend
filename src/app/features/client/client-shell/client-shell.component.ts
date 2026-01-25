import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Breadcrumbs } from "../../shared/breadcumbs/breadcumbs";

@Component({
  selector: 'app-client-shell',
  standalone: true,
  template: `<div>
                <app-breadcrumbs></app-breadcrumbs>
                <router-outlet></router-outlet>
            </div>`,
  imports: [RouterOutlet, Breadcrumbs],
})
export class ClientShellComponent {}
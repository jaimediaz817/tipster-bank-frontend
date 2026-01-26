import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Breadcrumbs } from "../../shared/breadcumbs/breadcumbs";

@Component({
  selector: 'app-analyst-shell',
  standalone: true,
  template: `
    <div> 
      <router-outlet></router-outlet>
    </div>            
            `,
  imports: [RouterOutlet],
})
export class AnalystShellComponent {}
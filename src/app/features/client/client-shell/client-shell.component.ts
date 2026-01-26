import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-client-shell',
  standalone: true,
  template: `<div>
                <router-outlet></router-outlet>
            </div>`,
  imports: [RouterOutlet],
})
export class ClientShellComponent {}
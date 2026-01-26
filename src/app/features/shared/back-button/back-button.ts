import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-button.html',
  styleUrls: ['./back-button.css'],
})
export class BackButton {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @Input() label = 'Volver';
  @Input() mode: 'parent' | 'history' = 'parent'; // 'parent' por defecto para jerarquía
  @Input() defaultUrl?: string; // Fallback opcional (ej: '/dashboard/client/credits')
  @Input() disabled = false;

  @Output() navigated = new EventEmitter<string>();

  async onClick() {
    if (this.disabled) return;

    try {
      if (this.mode === 'history' && window.history.length > 1) {
        window.history.back();
        this.navigated.emit('history');
        return;
      }
      // parent mode o fallback
      const ok = await this.router.navigate(['..'], { relativeTo: this.route });
      if (!ok && this.defaultUrl) {
        await this.router.navigateByUrl(this.defaultUrl);
        this.navigated.emit(this.defaultUrl);
      } else {
        this.navigated.emit('parent');
      }
    } catch {
      if (this.defaultUrl) {
        await this.router.navigateByUrl(this.defaultUrl);
        this.navigated.emit(this.defaultUrl);
      }
    }
  }
}
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditsService } from '../../../core/services/credits.service';
import { CreditApplication, CreditStatus } from '../../../core/models/credit.models';
// import { CreditsService } from '../../core/services/credits.service';
import { RouterLink } from '@angular/router'; // <--- Importar RouterLink
// import { CreditApplication, CreditStatus } from '../../core/models/credit.models';

@Component({
  selector: 'app-client-credits-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-credits-page.html',
  styleUrls: ['./client-credits-page.css'],
})
export class ClientCreditsPage implements OnInit {
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  credits = signal<CreditApplication[]>([]);

  constructor(private creditsService: CreditsService) {}

  ngOnInit(): void {
    this.loadCredits();
  }

  loadCredits(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.creditsService.getMyCredits().subscribe({
      next: (data) => {
        this.credits.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[ClientCredits] Error cargando créditos', err);
        this.errorMessage.set('No fue posible cargar tus solicitudes. Intenta nuevamente.');
        this.isLoading.set(false);
      },
    });
  }

  statusLabel(status: CreditStatus): string {
    switch (status) {
      case 'EN_REVISION':
        return 'En revisión';
      case 'APROBADO':
        return 'Aprobado';
      case 'RECHAZADO':
        return 'Rechazado';
      default:
        return status;
    }
  }

  statusClasses(status: CreditStatus): string {
    switch (status) {
      case 'EN_REVISION':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'APROBADO':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'RECHAZADO':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  }
}

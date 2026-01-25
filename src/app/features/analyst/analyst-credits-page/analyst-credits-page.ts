import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreditsService } from '../../../core/services/credits.service';
import {
  CreditApplication,
  CreditStatus,
  ChangeCreditStatusRequest,
  PageResponse,
  CreditKpiSummary,
} from '../../../core/models/credit.models';
import { ToastStore } from '../../../core/state/toast.store';

type StatusFilter = CreditStatus | 'ALL';

@Component({
  selector: 'app-analyst-credits-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './analyst-credits-page.html',
})
export class AnalystCreditsPage implements OnInit {

  private toastStore = inject(ToastStore);
  // Estado principal
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // Page de créditos
  creditsPage = signal<PageResponse<CreditApplication> | null>(null);
  statusFilter = signal<StatusFilter>('EN_REVISION');
  clientQuery = signal<string>('');
  currentPage = signal(0);
  pageSize = signal(10);

  // KPIs
  summary = signal<CreditKpiSummary | null>(null);
  isLoadingSummary = signal(false);

  // Modal
  isModalOpen = signal(false);
  selectedCredit = signal<CreditApplication | null>(null);
  statusForm: FormGroup;

  constructor(
    private creditsService: CreditsService,
    private fb: FormBuilder,
  ) {
    this.statusForm = this.fb.group({
      newStatus: ['APROBADO' as CreditStatus, [Validators.required]],
      analystComments: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    this.loadSummary();
    this.loadCredits();
  }

  // 🔹 Cargar KPIs
  loadSummary(): void {
    this.isLoadingSummary.set(true);
    this.creditsService.getAnalystSummary().subscribe({
      next: (data) => {
        this.summary.set(data);
        this.isLoadingSummary.set(false);
      },
      error: (err) => {
        console.error('[AnalystCredits] Error cargando summary', err);
        this.isLoadingSummary.set(false);
      },
    });
  }

  // 🔹 Cargar créditos paginados
  loadCredits(page?: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    if (page !== undefined) {
      this.currentPage.set(page);
    }

    const status = this.statusFilter();
    const pageIndex = this.currentPage();
    const size = this.pageSize();
    const clientName = this.clientQuery();

    this.creditsService
      .getCreditsForAnalyst(status, pageIndex, size, clientName)
      .subscribe({
        next: (data) => {
          this.creditsPage.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('[AnalystCredits] Error cargando créditos', err);
          this.errorMessage.set('No fue posible cargar las solicitudes. Intenta nuevamente.');
          this.isLoading.set(false);
        },
      });
  }

  setFilter(filter: StatusFilter): void {
    this.statusFilter.set(filter);
    this.currentPage.set(0);
    this.loadCredits(0);
  }

  onSearch(): void {
    this.currentPage.set(0);
    this.loadCredits(0);
  }

  clearSearch(): void {
    this.clientQuery.set('');
    this.currentPage.set(0);
    this.loadCredits(0);
  }

  canGoPrev(): boolean {
    const page = this.creditsPage();
    return !!page && page.number > 0;
  }

  canGoNext(): boolean {
    const page = this.creditsPage();
    return !!page && page.number < page.totalPages - 1;
  }

  goPrev(): void {
    if (this.canGoPrev()) {
      this.loadCredits(this.currentPage() - 1);
    }
  }

  goNext(): void {
    if (this.canGoNext()) {
      this.loadCredits(this.currentPage() + 1);
    }
  }

  openModal(credit: CreditApplication): void {
    this.selectedCredit.set(credit);

    this.statusForm.setValue({
      newStatus: credit.status,
      analystComments: credit.analystComments ?? '',
    });

    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedCredit.set(null);
    this.statusForm.reset({
      newStatus: 'APROBADO',
      analystComments: '',
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

  filterClasses(filter: StatusFilter): string {
    const base =
      'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer';
    const active =
      'bg-indigo-50 text-indigo-700 border-indigo-400';
    const inactive =
      'bg-white text-slate-500 border-slate-200 hover:bg-slate-50';

    return `${base} ${this.statusFilter() === filter ? active : inactive}`;
  }

  // 🔹 Enviar cambio de estado
  onSubmitStatus(): void {
    if (this.statusForm.invalid || !this.selectedCredit()) {
      this.statusForm.markAllAsTouched();
      return;
    }

    const credit = this.selectedCredit()!;
    const payload: ChangeCreditStatusRequest = this.statusForm.value;

    this.isLoading.set(true);

    this.creditsService.changeStatus(credit.id, payload).subscribe({
      next: (updated) => {
        // Actualizamos la página actual en memoria
        const page = this.creditsPage();
        if (page) {
          const updatedContent = page.content.map((c) =>
            c.id === updated.id ? updated : c,
          );
          this.creditsPage.set({ ...page, content: updatedContent });
        }

        this.isLoading.set(false);
        this.closeModal();

        // Actualizamos KPIs
        this.loadSummary();

        this.toastStore.success('Estado actualizado correctamente ✅');

        // Si estamos filtrando EN_REVISION y pasó a otro estado, recargamos la lista
        if (this.statusFilter() === 'EN_REVISION' && updated.status !== 'EN_REVISION') {
          this.loadCredits(this.currentPage());
        }
      },
      error: (err) => {
        console.error('[AnalystCredits] Error cambiando estado', err);
        this.toastStore.error('Error al actualizar el estado de la solicitud.');
        this.errorMessage.set('No fue posible cambiar el estado. Intenta nuevamente.');
        this.isLoading.set(false);
      },
    });
  }
}

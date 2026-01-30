import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreditProduct, Currency, IncomeSource } from '../../../core/models/catalog.models';
import { CatalogsService } from '../../../core/services/catalogs.service';
import { CreditsService } from '../../../core/services/credits.service';
import { CreateCreditRequest } from '../../../core/models/credit.models';
import { ToastStore } from '../../../core/state/toast.store';
import { BackButton } from '../../shared/back-button/back-button';
import { PageContainer } from '../../shared/pages-tools/page-container/page-container';

@Component({
    selector: 'app-new-credit-request-page',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, BackButton, PageContainer],
    templateUrl: './new-credit-request-page.html',
    styleUrls: ['./new-credit-request-page.css'],
})
export class NewCreditRequestPage implements OnInit {
    form: FormGroup;

    private toastStore = inject(ToastStore);
    isLoadingCatalogs = signal(false);
    isSubmitting = signal(false);
    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);

    creditProducts = signal<CreditProduct[]>([]);
    currencies = signal<Currency[]>([]);
    incomeSources = signal<IncomeSource[]>([]);

    constructor(
        private fb: FormBuilder,
        private catalogsService: CatalogsService,
        private creditsService: CreditsService,
        private router: Router,
    ) {
        this.form = this.fb.group({
            amount: [null, [Validators.required, Validators.min(1000000)]],
            termMonths: [12, [Validators.required, Validators.min(6), Validators.max(120)]],
            referenceRate: [0.18, [Validators.required, Validators.min(0.01), Validators.max(1)]],
            purpose: ['', [Validators.required, Validators.minLength(5)]],
            creditProductId: [null, [Validators.required]],
            currencyId: [null, [Validators.required]],
            incomeSourceId: [null, [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.loadCatalogs();
    }

    get amount() {
        return this.form.get('amount');
    }
    get termMonths() {
        return this.form.get('termMonths');
    }
    get referenceRate() {
        return this.form.get('referenceRate');
    }
    get purpose() {
        return this.form.get('purpose');
    }

    private loadCatalogs(): void {
        this.isLoadingCatalogs.set(true);
        this.errorMessage.set(null);

        // Puedes optimizar con forkJoin; para claridad lo hago secuencial
        this.catalogsService.getCreditProducts().subscribe({
            next: (products) => {
                this.creditProducts.set(products);

                this.catalogsService.getCurrencies().subscribe({
                    next: (currencies) => {
                        this.currencies.set(currencies);

                        this.catalogsService.getIncomeSources().subscribe({
                            next: (sources) => {
                                this.incomeSources.set(sources);
                                this.isLoadingCatalogs.set(false);
                            },
                            error: (err) => {
                                console.error('[NewCredit] Error incomeSources', err);
                                this.errorMessage.set(
                                    'No se pudieron cargar las fuentes de ingresos.',
                                );
                                this.isLoadingCatalogs.set(false);
                            },
                        });
                    },
                    error: (err) => {
                        console.error('[NewCredit] Error currencies', err);
                        this.errorMessage.set('No se pudieron cargar las monedas.');
                        this.isLoadingCatalogs.set(false);
                    },
                });
            },
            error: (err) => {
                console.error('[NewCredit] Error creditProducts', err);
                this.errorMessage.set('No se pudieron cargar los tipos de crédito.');
                this.isLoadingCatalogs.set(false);
            },
        });
    }

    onSubmit(): void {
        if (this.form.invalid || this.isSubmitting()) {
            this.form.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);
        this.errorMessage.set(null);
        this.successMessage.set(null);

        const payload: CreateCreditRequest = this.form.value;

        this.creditsService.createCredit(payload).subscribe({
            next: (credit) => {
                this.isSubmitting.set(false);
                this.successMessage.set('Solicitud creada correctamente.');

                this.toastStore.success('Solicitud creada correctamente ✅');
                this.form.reset();

                // Opcional: navegar a mis solicitudes
                setTimeout(() => {
                    this.router.navigate(['/dashboard/client/my-credits']);
                }, 1000);
            },
            error: (err) => {
                console.error('[NewCredit] Error creando solicitud', err);
                this.isSubmitting.set(false);
                this.toastStore.error('No se pudo crear la solicitud. Inténtalo de nuevo.');
                if (err.status === 400) {
                    this.errorMessage.set('Datos inválidos. Revisa la información del formulario.');
                } else {
                    this.errorMessage.set('No fue posible crear la solicitud. Intenta nuevamente.');
                }
            },
        });
    }
}

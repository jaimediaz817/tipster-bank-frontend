import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { PaymentsService } from '../../../core/services/payments.service';
import {
  PaymentSimulationRequest,
  PaymentInstallment,
} from '../../../core/models/payments.models';
import { BackButton } from '../../shared/back-button/back-button';

@Component({
  selector: 'app-credit-simulator-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackButton],
  templateUrl: './credit-simulator-page.html',
})
export class CreditSimulatorPage {
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  schedule = signal<PaymentInstallment[]>([]);

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private paymentsService: PaymentsService,
  ) {
    this.form = this.fb.group({
      amount: [10000000, [Validators.required, Validators.min(1000000)]],
      termMonths: [36, [Validators.required, Validators.min(6), Validators.max(120)]],
      annualRate: [0.18, [Validators.required, Validators.min(0.01), Validators.max(1)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: PaymentSimulationRequest = this.form.value;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.schedule.set([]);

    this.paymentsService.simulate(payload).subscribe({
      next: (data) => {
        this.schedule.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[Simulator] Error', err);
        this.errorMessage.set(
          'No fue posible simular el plan de pagos. Intenta nuevamente.',
        );
        this.isLoading.set(false);
      },
    });
  }

  resetSimulation(): void {
    this.schedule.set([]);
    this.errorMessage.set(null);
    this.form.reset({
      amount: 10000000,
      termMonths: 36,
      annualRate: 0.18,
    });
  }  

  get totalPayment(): number {
    return this.schedule().reduce((acc, q) => acc + q.total, 0);
  }

  get totalInterest(): number {
    return this.schedule().reduce((acc, q) => acc + q.interest, 0);
  }
}

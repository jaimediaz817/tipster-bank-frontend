import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PaymentSimulationRequest,
  PaymentInstallment,
} from '../models/payments.models';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/payments';

  simulate(request: PaymentSimulationRequest): Observable<PaymentInstallment[]> {
    return this.http.post<PaymentInstallment[]>(
      `${this.baseUrl}/simulate`,
      request,
    );
  }
}

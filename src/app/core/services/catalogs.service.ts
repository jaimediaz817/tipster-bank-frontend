import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreditProduct, Currency, IncomeSource } from '../models/catalog.models';

@Injectable({ providedIn: 'root' })
export class CatalogsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/catalogs';

  getCreditProducts(): Observable<CreditProduct[]> {
    return this.http.get<CreditProduct[]>(`${this.baseUrl}/credit-products`);
  }

  getCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${this.baseUrl}/currencies`);
  }

  getIncomeSources(): Observable<IncomeSource[]> {
    return this.http.get<IncomeSource[]>(`${this.baseUrl}/income-sources`);
  }
}

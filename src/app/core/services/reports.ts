// filepath: src/app/core/services/reports.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetailedPortfolioReport, ClientExposureReport } from '../models/reports.models';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/reports/credits'; // ¡Ajusta si es necesario!

  getDetailedPortfolioReport(): Observable<DetailedPortfolioReport[]> {
    return this.http.get<DetailedPortfolioReport[]>(`${this.baseUrl}/analyst`);
  }

  getClientExposureReport(): Observable<ClientExposureReport[]> {
    return this.http.get<ClientExposureReport[]>(`${this.baseUrl}/client-simulation`);
  }
}
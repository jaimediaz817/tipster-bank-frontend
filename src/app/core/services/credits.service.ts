import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChangeCreditStatusRequest, CreateCreditRequest, CreditApplication, CreditKpiSummary, CreditStatus, PageResponse } from '../models/credit.models';
import { CreditsSummary } from '../models/credits-summary.models';

@Injectable({ providedIn: 'root' })
export class CreditsService {

    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:8080/api/credits';

    // CLIENTE
    getMyCredits(): Observable<CreditApplication[]> {
        return this.http.get<CreditApplication[]>(`${this.baseUrl}/my`);
    }

    createCredit(request: CreateCreditRequest): Observable<CreditApplication> {
        return this.http.post<CreditApplication>(this.baseUrl, request);
    }

    // ANALISTA
    // ANALISTA – paginado y filtrado
    getCreditsForAnalyst(
        status?: CreditStatus | 'ALL',
        page: number = 0,
        size: number = 10,
        clientName?: string,
    ): Observable<PageResponse<CreditApplication>> {
        let params = new HttpParams()
        .set('page', page)
        .set('size', size);

        if (status && status !== 'ALL') {
        params = params.set('status', status);
        }
        if (clientName && clientName.trim().length > 0) {
        params = params.set('client', clientName.trim());
        }

        return this.http.get<PageResponse<CreditApplication>>(`${this.baseUrl}/analyst/paged`, { params });
    }

    //   getCreditsForAnalyst(status?: CreditStatus | 'ALL'): Observable<CreditApplication[]> {
    //     let params = new HttpParams();
    //     if (status && status !== 'ALL') {
    //       params = params.set('status', status);
    //     }
    //     return this.http.get<CreditApplication[]>(this.baseUrl, { params });
    //   }

    //   changeStatus(
    //     creditId: number,
    //     payload: ChangeCreditStatusRequest,
    //   ): Observable<CreditApplication> {
    //     return this.http.patch<CreditApplication>(
    //       `${this.baseUrl}/${creditId}/status`,
    //       payload,
    //     );
    //   }

    changeStatus(
        creditId: number,
        payload: ChangeCreditStatusRequest,
    ): Observable<CreditApplication> {
        return this.http.patch<CreditApplication>(
        `${this.baseUrl}/${creditId}/status`,
        payload,
        );
    }

    // KPIs para tarjetas resumen
    getAnalystSummary(): Observable<CreditKpiSummary> {
        return this.http.get<CreditKpiSummary>(`${this.baseUrl}/summary`);
    }

    getChartSummaryForAnalyst() {
        return this.http.get<CreditsSummary>(`${this.baseUrl}/summary/chart`);
    }  
}
